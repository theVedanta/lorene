const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  let error = req.query.error;
  res.render("admin/add-admin", { message: error });
});

router.post("/", async (req, res) => {
  const body = req.body;

  if (body.password.length < 4 || body.password.length > 50) {
    res.redirect("/admin/add-admin?error=Password too short or long");
  } else if (!passCheck(body.password)) {
    res.redirect("/admin/add-admin?error=Password must have a number");
  } else {
    const password = await bcrypt.hash(body.password, 10);

    const admin = {
      name: body.name,
      username: body.username,
      password: password,
    };

    try {
      await Admin.create(admin);
      res.redirect("/admin/users");
    } catch (err) {
      if (err.code === 11000) {
        res.redirect("/admin/add-admin?error=Username Already Exists");
      } else {
        res.redirect("/err");
      }
    }
  }
});

function passCheck(pass) {
  let valid = false;
  for (let letter of pass) {
    if (parseInt(letter)) {
      valid = true;
    }
  }

  return valid;
}

module.exports = router;
