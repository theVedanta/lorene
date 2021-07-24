const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");
const User = require("../../models/user");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("admin/verify", { user: user });
});

router.put("/:id", async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, { $set: { verified: true } });
    res.redirect("/admin");
  } catch (err) {
    res.redirect("/err");
  }
});

module.exports = router;
