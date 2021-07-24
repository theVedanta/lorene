const express = require("express");
const router = express.Router();
const User = require("../models/user");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const iT = require("../models/invalidTokens");

router.use(methodOverride("_method"));

// get
router.get("/", async (req, res) => {
  res.render("user/change-pw", { error: req.query.error });
});

router.put("/", async (req, res) => {
  const user = await User.findById(req.user.id);
  const body = req.body;

  if (await bcrypt.compare(body.old, user.password)) {
    if (body.password.length < 4 || body.password.length > 50) {
      return res.redirect("/change-pw?error=Password too short or long");
    } else if (!passCheck(body.password)) {
      return res.redirect("/change-pw?error=Password must have a number");
    } else {
      const newPassword = await bcrypt.hash(body.password, 10);

      try {
        await User.updateOne(
          { _id: req.user.id },
          { $set: { password: newPassword } }
        );
        let userToSign = {
          id: req.user.id,
        };

        const accessToken = jwt.sign(
          userToSign,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "24h",
          }
        );

        const invToken = {
          token: req.cookies["auth-token"],
          toDelete: true,
        };

        iT.create(invToken);
        res
          .cookie("auth-token", accessToken, { maxAge: 172800000 })
          .redirect("/dashboard");
      } catch (err) {
        return res.redirect("/err");
      }
    }
  } else {
    res.redirect("/change-pw?error=Password Incorrect");
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

// Check every 24 hours
const now = new Date();
let millisTill24 =
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0, 0) - now;

if (millisTill24 < 0) {
  millisTill24 += 86400000;
}
setTimeout(async () => {
  try {
    await iT.deleteMany({ toDelete: true });
  } catch (err) {}
}, millisTill24);

module.exports = router;
