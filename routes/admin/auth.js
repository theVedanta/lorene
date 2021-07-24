const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("admin/auth", { message: false });
});
router.post("/", async (req, res) => {
  const body = req.body;
  const adminFound = await Admin.findOne({ username: body.username });

  if (!adminFound) {
    res.render("admin/auth", { message: "No Admin found" });
  } else {
    let admin = {
      id: adminFound._id,
    };
    if (await bcrypt.compare(body.password, adminFound.password)) {
      const accessToken = jwt.sign(admin, process.env.ADMIN_TOKEN_SECRET, {
        expiresIn: "24h",
      });
      res
        .cookie("auth-token-admin", accessToken, { maxAge: 172800000 })
        .redirect("/admin");
    } else {
      res.render("admin/auth", { message: "Incorrect Password" });
    }
  }
});

module.exports = router;
