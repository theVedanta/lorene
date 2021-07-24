const express = require("express");
const router = express.Router();
const Msg = require("../models/msg");

router.post("/", (req, res) => {
  const body = req.body;

  let msg = {
    name: body.name,
    subject: body.subject,
    mail: body.mail,
    phone: body.phone,
    message: body.message,
  };

  try {
    Msg.create(msg);
    res.redirect("/");
  } catch (err) {
    res.redirect("/err");
  }
});

module.exports = router;
