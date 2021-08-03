const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");

// Auth
router.use("/auth", checkNotAdminAuth, require("./auth"));

// See Users
router.get("/users", checkAdminAuth, async (req, res) => {
  const admins = await Admin.find();
  res.render("admin/users", { admins: admins });
});

// Add Users
router.use("/add-admin", checkAdminAuth, require("./add-admin"));

// Verify Merchants
router.use("/verify", checkAdminAuth, require("./verify"));

// Home
router.use("/", checkAdminAuth, require("./home"));

// Middle
function checkAdminAuth(req, res, next) {
  let token = req.cookies["auth-token-admin"];

  if (!token) {
    res.redirect("/admin/auth");
  } else {
    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, async (err, admin) => {
      if (err) {
        res.redirect("/admin/auth");
      } else {
        const getAdmin = await Admin.findById(admin.id);
        if (getAdmin) {
          req.admin = admin;
          next();
        } else {
          res.redirect("/admin/auth");
        }
      }
    });
  }
}

function checkNotAdminAuth(req, res, next) {
  let token = req.cookies["auth-token-admin"];

  if (!token) {
    next();
  } else {
    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, async (err, admin) => {
      if (err) {
        next();
      } else {
        const getAdmin = await Admin.findById(admin.id);
        if (getAdmin) {
          res.redirect("/admin");
          req.admin = admin;
          next();
        } else {
          res.redirect("/admin/auth");
        }
      }
    });
  }
}

module.exports = router;
