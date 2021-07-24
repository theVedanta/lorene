const express = require("express");
const router = express.Router();
const Pages = require("../models/pages");
const multer = require("multer");
const Grid = require("gridfs-stream");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const tinify = require("tinify");
tinify.key = "g0n8WvvQ9w2vZp0kXChwcGHgK4z5B0bQ";
const uuid = require("uuid");
const Page = require("../models/pages");
const uniqid = require("uniqid");
const Tax = require("../models/tax");
const User = require("../models/user");
const methodOverride = require("method-override");

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

// GET
router.get("/", async (req, res) => {
  const pages = await Pages.find({
    user: req.user.id,
  }).sort({ _id: -1 });
  const user = await User.findById(req.user.id);
  res.render("pages/pages", {
    pages: pages,
    user: user,
    verErr: req.query.verErr,
  });
});

// MAKE
router.get("/add", checkVerified, async (req, res) => {
  const taxes = await Tax.find({ user: req.user.id, active: true }).sort({
    _id: -1,
  });
  const user = await User.findById(req.user.id);
  res.render("pages/add", {
    message: req.query.err,
    taxes: taxes,
    user: user,
  });
});
router.post("/add", checkVerified, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.redirect("/pages/add?err=File Size too large, below 4mb");
      } else {
        res.redirect(
          "/pages/add?err=Some error occurred while uploading images, please use the correct format"
        );
      }
    } else {
      const body = req.body;

      let filenames = [];

      // Compress
      for (let file of req.files) {
        let source = tinify.fromFile(file.filename);
        await source.toFile("toConvert.jpg");
        let filename = `${uuid.v4()}-${Date.now()}.jpg`;
        filenames.push(filename);
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

      let contact = {};
      if (body.mail) {
        contact["mail"] = body.mail;
      }
      if (body.phone) {
        contact["phone"] = body.phone;
      }

      let url = `${uniqid("page-")}`;

      let total = 0;
      let totalTax = 0;
      let price = 0;
      let discount = 0;
      let tax = 0;
      let taxObj = {};

      if (body.priceType !== "customer") {
        price = parseInt(body.price);
        discount = (parseInt(body.discount) / 100) * price;
      } else {
        price = 0;
        discount = 0;
        tax = totalTax;
      }

      if (body.tax) {
        if (Array.isArray(body.tax)) {
          for (let taxe of body.tax) {
            totalTax += parseInt(taxe);
            let orignialTax = await Tax.findOne({
              user: req.user.id,
              offer: parseInt(taxe),
              active: true,
            });

            taxObj[orignialTax.name] = orignialTax.offer;
          }
        } else {
          totalTax = parseInt(body.tax);
          let orignialTax = await Tax.findOne({
            user: req.user.id,
            offer: parseInt(body.tax),
            active: true,
          });

          taxObj[orignialTax.name] = orignialTax.offer;
        }
        tax = (totalTax / 100) * (price - discount);
      } else {
        tax = 0;
      }

      if (body.priceType !== "customer") {
        total = price - discount + tax;
      } else {
        total = 0;
      }

      let page = {
        user: req.user.id,
        name: body.name,
        images: filenames,
        video: body.video,
        description: body.description,
        terms: body.terms,
        price: price,
        priceType: body.priceType,
        discount: body.discount,
        tax: totalTax,
        total: total,
        active: true,
        contact: contact,
        taxObj: taxObj,
        social: body.social,
        url: url,
      };

      try {
        await Page.create(page);
        res.redirect("/pages");
      } catch (err) {
        res.redirect("/err");
      }
    }
  });
});

// delete
router.get("/delete/:id", checkVerified, async (req, res) => {
  let page = await Page.findOne({ user: req.user.id, _id: req.params.id });
  for (let img of page.images) {
    gfs.remove({ filename: img, root: "fs" }, (err, gridStore) => {
      if (err) {
        res.redirect("/err");
      }
    });
  }
  await Page.deleteOne({ _id: req.params.id, user: req.user.id });
  res.redirect("/pages");
});

// EDIT
router.get("/edit/:id", checkVerified, async (req, res) => {
  const page = await Page.findOne({ user: req.user.id, _id: req.params.id });
  const taxes = await Tax.find({ user: req.user.id, active: true });
  const user = await User.findById(req.user.id);

  res.render("pages/edit", {
    page: page,
    taxes: taxes,
    active: true,
    message: false,
    user: user,
  });
});
router.put("/edit/:id", async (req, res) => {
  const page = await Page.findOne({ user: req.user.id, _id: req.params.id });
  let imgs = page.images;

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.render("pages/edit", {
          message: "File Size too large, below 4mb",
        });
      } else {
        res.render("pages/edit", {
          message:
            "Some error occurred while uploading images, please use the correct format",
        });
      }
    } else {
      const body = req.body;

      if (body.toRem) {
        if (!Array.isArray(body.toRem)) {
          gfs.remove(
            { filename: imgs[parseInt(body.toRem) - 1], root: "fs" },
            (err, gridStore) => {
              if (err) {
                res.redirect("/err");
              }
            }
          );
          imgs.splice(parseInt(body.toRem) - 1, 1);
        } else {
          for (let i = 0; i < body.toRem.length; i++) {
            gfs.remove(
              { filename: imgs[parseInt(body.toRem[i]) - (i + 1)], root: "fs" },
              (err, gridStore) => {
                if (err) {
                  res.redirect("/err");
                }
              }
            );
            imgs.splice(parseInt(body.toRem[i]) - (i + 1), 1);
          }
        }
      }

      // Compress
      if (req.files) {
        for (let file of req.files) {
          let source = tinify.fromFile(file.filename);
          await source.toFile("toConvert.jpg");
          let filename = `${uuid.v4()}-${Date.now()}.jpg`;
          if (file.fieldname === "img1") {
            gfs.remove({ filename: imgs[0], root: "fs" }, (err, gridStore) => {
              if (err) {
                res.redirect("/err");
              }
            });
            imgs.splice(0, 1);
            imgs.splice(0, 0, filename);
          } else if (file.fieldname === "img2") {
            gfs.remove({ filename: imgs[1], root: "fs" }, (err, gridStore) => {
              if (err) {
                res.redirect("/err");
              }
            });
            imgs.splice(1, 1);
            imgs.splice(1, 0, filename);
          } else {
            gfs.remove({ filename: imgs[2], root: "fs" }, (err, gridStore) => {
              if (err) {
                res.redirect("/err");
              }
            });
            imgs.splice(2, 1);
            imgs.splice(2, 0, filename);
          }
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
      }

      let contact = {};
      if (body.mail) {
        contact["mail"] = body.mail;
      }
      if (body.phone) {
        contact["phone"] = body.phone;
      }

      let total = 0;
      let totalTax = 0;
      let price = 0;
      let discount = 0;
      let tax = 0;
      let taxObj = {};

      if (body.priceType !== "customer") {
        price = parseInt(body.price);
        discount = (parseInt(body.discount) / 100) * price;
      } else {
        price = 0;
        discount = 0;
        tax = totalTax;
      }

      if (body.tax) {
        if (Array.isArray(body.tax)) {
          for (let taxe of body.tax) {
            totalTax += parseInt(taxe);
            let orignialTax = await Tax.findOne({
              user: req.user.id,
              offer: parseInt(taxe),
              active: true,
            });

            taxObj[orignialTax.name] = orignialTax.offer;
          }
        } else {
          totalTax = parseInt(body.tax);
          let orignialTax = await Tax.findOne({
            user: req.user.id,
            offer: parseInt(body.tax),
            active: true,
          });

          taxObj[orignialTax.name] = orignialTax.offer;
        }
        tax = (totalTax / 100) * (price - discount);
      } else {
        tax = 0;
      }

      if (body.priceType !== "customer") {
        total = price - discount + tax;
      } else {
        total = 0;
      }

      try {
        await Page.updateOne(
          { user: req.user.id, _id: req.params.id },
          {
            $set: {
              name: body.name,
              images: imgs,
              video: body.video,
              description: body.description,
              terms: body.terms,
              price: price,
              priceType: body.priceType,
              discount: body.discount,
              tax: totalTax,
              total: total,
              contact: contact,
              taxObj: taxObj,
              social: body.social,
            },
          }
        );
        res.redirect("/pages");
      } catch (err) {
        res.redirect("/err");
      }
    }
  });
});

// Toggle
router.put("/toggle/:id", checkVerified, async (req, res) => {
  try {
    const page = await Page.findOne({ user: req.user.id, _id: req.params.id });
    await Page.updateOne(
      { user: req.user.id, _id: req.params.id },
      {
        $set: {
          active: !page.active,
        },
      }
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ done: "yes" });
  } catch (err) {
    res.json({ error: "Some error occurred" });
  }
});

// PRODUCT
router.get("/product/:url", async (req, res) => {
  const user = await User.findById(req.user.id);
  const page = await Page.findOne({ url: req.params.url, active: true });
  if (!page) {
    res.redirect("/404");
  } else {
    res.render("pages/product", { page: page, user: user });
  }
});

module.exports = router;

// MIDDLEWARE
async function checkVerified(req, res, next) {
  const user = await User.findById(req.user.id);

  if (user.verified) {
    next();
  } else {
    res.redirect("/invoices?verErr=Verify Account to use services");
  }
}
