const express = require("express");
const router = express.Router();
const Tax = require("../models/tax");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

// ADD
router.post("/add", async (req, res) => {
  let body = req.body;

  let tax = {
    user: req.user.id,
    name: body.name,
    offer: body.offer,
    active: true,
  };

  try {
    await Tax.create(tax);
    res.json({ done: true });
  } catch (err) {
    res.json({ err: "Some error occurred" });
  }
});

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    await Tax.deleteOne({ user: req.user.id, _id: req.params.id });
    res.json({ done: true });
  } catch (err) {
    res.redirect("/err");
  }
});

// EDIT
router.put("/edit/:id", async (req, res) => {
  let body = req.body;

  try {
    await Tax.updateOne(
      { user: req.user.id, _id: req.params.id },
      {
        $set: {
          name: body.name,
          offer: body.offer,
        },
      }
    );
    res.json({ done: true });
  } catch (err) {
    res.redirect("/err");
  }
});

// Toggle
router.put("/toggle/:id", async (req, res) => {
  try {
    const tax = await Tax.findOne({ user: req.user.id, _id: req.params.id });
    await Tax.updateOne(
      { user: req.user.id, _id: req.params.id },
      {
        $set: {
          active: !tax.active,
        },
      }
    );
    res.json({ done: "yes" });
  } catch (err) {
    res.redirect("/err");
  }
});

module.exports = router;
