const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const User = require("../models/user");
const tinify = require("tinify");
tinify.key = "g0n8WvvQ9w2vZp0kXChwcGHgK4z5B0bQ";
const Grid = require("gridfs-stream");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const uuid = require("uuid");
const path = require("path");

router.use(methodOverride("_method"));

// GRIDFS SETTINGS
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

const storage = multer.diskStorage({
  destination: ".",
  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, `${uuid.v4()}-${Date.now()}` + path.extname(file.originalname));
    } else {
      cb(new Error("Only Image Files are allowed"), false);
    }
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 4194304 },
}).any();

// Get
router.get("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("user/account", { user: user, err: req.query.err });
});
router.put("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.redirect("/account?err=File Size too large, below 4mb");
      } else {
        return res.redirect(
          "/account?err=Some error occurred while uploading images, please use the correct format"
        );
      }
    } else {
      const body = req.body;
      let front;
      let back;

      // Compress
      for (let file of req.files) {
        let source = tinify.fromFile(file.filename);
        await source.toFile("toConvert.jpg");
        let filename = `${uuid.v4()}-${Date.now()}.jpg`;
        if (file.fieldname === "front") {
          front = filename;
        } else {
          back = filename;
        }
        // filenames.push(filename);
        const writeStream = gfs.createWriteStream(filename);
        await fs.createReadStream(`./toConvert.jpg`).pipe(writeStream);
        fs.unlink("toConvert.jpg", (err) => {
          if (err) {
            res.send(err);
          }
        });
        fs.unlink(`${file.filename}`, (err) => {
          if (err) {
            res.send(err);
          }
        });
      }

      let gst;

      if (user.type !== "individual") {
        gst = body.gst;
      }

      try {
        await User.updateOne(
          { _id: req.user.id },
          {
            $set: {
              pan: body.pan,
              aadhaarFront: front,
              aadhaarBack: back,
              gst: gst,
            },
          }
        );
        if (user.bankInfo) {
          return res.redirect("/account");
        } else {
          return res.redirect("/settings");
        }
      } catch (err) {
        res.redirect("/err");
      }
    }
  });
});

module.exports = router;
