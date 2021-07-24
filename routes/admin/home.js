const express = require("express");
const router = express.Router();
const Admin = require("../../models/admin");
const User = require("../../models/user");

router.get("/", async (req, res) => {
  const usersToVerify = await User.find({
    bankInfo: { $exists: true },
    pan: { $exists: true },
    aadhaarFront: { $exists: true },
    aadhaarBack: { $exists: true },
    address: { $exists: true },
    verified: false,
  }).sort({ _id: -1 });
  res.render("admin/home", { users: usersToVerify });
});

module.exports = router;
