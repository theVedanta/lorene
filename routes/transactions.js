const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("transactions/display", { user: user, verErr: req.query.verErr });
});

module.exports = router;
