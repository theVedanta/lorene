const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about/landing");
});

router.get("/info/:type", (req, res) => {
  let type = req.params.type;
  if (type === "terms") {
    res.render("about/info", { info: "terms" });
  } else if (type === "privacy") {
    res.render("about/info", { info: "privacy" });
  } else if (type === "cancellation") {
    res.render("about/info", { info: "cancellation" });
  } else {
    res.redirect("/404");
  }
});

module.exports = router;
