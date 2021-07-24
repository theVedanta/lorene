const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const User = require("../models/user");
const Tax = require("../models/tax");
const tinify = require("tinify");
tinify.key = "g0n8WvvQ9w2vZp0kXChwcGHgK4z5B0bQ";
const Grid = require("gridfs-stream");
const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const uuid = require("uuid");
const path = require("path");
const ifsc = require("ifsc");

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
}).single("logo");

// User
router.get("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  const taxes = await Tax.find({ user: req.user.id }).sort({ _id: -1 });
  let msg = undefined;
  if (req.query.error) {
    msg = req.query.error;
  }
  res.render("user/settings", { user: user, msg: msg, taxes: taxes });
});

//
router.put("/address", async (req, res) => {
  let body = req.body;

  let address = {
    line1: body.line1,
    line2: body.line2,
    city: body.city,
    zip: body.zip,
    state: body.state,
  };

  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          address: address,
        },
      }
    );
    res.redirect("/settings");
  } catch (err) {
    res.redirect("/err");
  }
});

// Logo
router.put("/logo", async (req, res) => {
  const user = await User.findById(req.user.id);
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.redirect("/settings?error=Logo file size too Big");
      } else {
        res.redirect(
          "/settings?error=Some error occurred while uploading images, please use the correct format"
        );
      }
    } else {
      try {
        if (req.file) {
          let source = tinify.fromFile(req.file.filename);
          await source.toFile("toConvert.jpg");
          let filename = `${uuid.v4()}-${Date.now()}.jpg`;
          const writeStream = gfs.createWriteStream(filename);
          await fs.createReadStream(`./toConvert.jpg`).pipe(writeStream);
          fs.unlink("toConvert.jpg", (err) => {
            if (err) {
              res.send(err);
            }
          });
          fs.unlink(`${req.file.filename}`, (err) => {
            if (err) {
              res.send(err);
            }
          });

          await User.updateOne(
            { _id: req.user.id },
            { $set: { logo: filename } }
          );

          if (user.logo) {
            gfs.remove(
              { filename: user.logo, root: "fs" },
              (err, gridStore) => {
                if (err) {
                  res.redirect("/err");
                }
              }
            );
          }
        }

        if (req.body.remLogo) {
          await User.updateOne({ _id: req.user.id }, { $unset: { logo: "" } });
        }

        res.redirect("/settings");
      } catch (err) {
        res.redirect("/err");
      }
    }
  });
});

// IFSC
router.post("/find", async (req, res) => {
  let code = req.body.ifsc;

  if (!ifsc.validate(code)) {
    res.json({ error: "Invalid IFSC Code" });
  } else {
    let details = await ifsc.fetchDetails(code);
    let obj = {
      bankName: details.BANK,
      bankBranch: details.BRANCH,
      bankAddress: details.ADDRESS,
    };

    res.json(obj);
  }
});

// Bank
router.put("/bank", async (req, res) => {
  let body = req.body;

  let code = body.ifsc;

  if (!ifsc.validate(code)) {
    res.redirect("/settings?error=Invalid IFSC Code");
  } else {
    let details = await ifsc.fetchDetails(code);

    let bankInfo = {
      number: body.number,
      type: body.type,
      ifsc: code,
      bankName: details.BANK,
      bankBranch: details.BRANCH,
      bankAddress: details.ADDRESS,
    };

    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          bankInfo: bankInfo,
        },
      }
    );

    res.redirect("/settings");
  }
});

module.exports = router;
