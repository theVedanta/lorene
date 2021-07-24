const express = require("express");
const router = express.Router();
const User = require("../models/user");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

// Dash
router.get("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("dash/dash", { user: user });
});

module.exports = router;
