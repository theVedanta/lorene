const express = require("express");
const router = express.Router();
const Paylink = require("../models/payment-link");
const methodOverride = require("method-override");
const User = require("../models/user");
const uniqid = require("uniqid");

router.use(methodOverride("_method"));

// Show
router.get("/", async (req, res) => {
  const paylinks = await Paylink.find({ user: req.user.id }).sort({ _id: -1 });
  const user = await User.findById(req.user.id);
  res.render("paylinks/display", {
    paylinks: paylinks,
    user: user,
    verErr: req.query.verErr,
  });
});

// Link
router.get("/:url", async (req, res) => {
  const paylink = await Paylink.findOne({ url: req.params.url });
  const user = await User.findById(paylink.user);

  if (paylink) {
    res.render("paylinks/link", { paylink: paylink, username: user.name });
  } else {
    res.redirect("/404");
  }
});

// Create
router.post("/add", checkVerified, async (req, res) => {
  const body = req.body;

  let multiple = false;
  let customer = {};
  let receipt;
  let paymodes = [];
  let returnUrl;
  const url = `${uniqid("paylink-")}`;

  if (body.multiple) {
    multiple = true;
  } else {
    customer = {
      name: body.customerName,
      phone: body.customerPhone,
      mail: body.customerMail,
    };
  }
  if (body.returnUrl) {
    returnUrl = body.returnUrl;
  }
  if (body.receipt) {
    receipt = body.receipt;
  }
  if (body.credit) {
    paymodes.push("credit");
  }
  if (body.debit) {
    paymodes.push("debit");
  }
  if (body.net) {
    paymodes.push("net");
  }
  if (body.upi) {
    paymodes.push("upi");
  }

  const paylink = {
    user: req.user.id,
    amount: body.amount,
    description: body.description,
    multiple: multiple,
    returnUrl: returnUrl,
    paymentModes: paymodes,
    status: "Pending",
    url: url,
    receipt: receipt,
    customer: customer,
  };

  try {
    await Paylink.create(paylink);
    res.redirect("/paylinks");
  } catch (err) {
    res.redirect("/err");
  }
});

// Delete
router.get("/delete/:id", checkVerified, async (req, res) => {
  await Paylink.deleteOne({ user: req.user.id, _id: req.params.id });
  res.redirect("/paylinks");
});

// View
router.get("/view/:id", checkVerified, async (req, res) => {
  const paylink = await Paylink.findOne({
    user: req.user.id,
    _id: req.params.id,
  });
  res.render("paylinks/view", { paylink: paylink });
});

module.exports = router;

// MIDDLEWARE
async function checkVerified(req, res, next) {
  const user = await User.findById(req.user.id);

  if (user.verified) {
    next();
  } else {
    res.redirect("/paylinks?verErr=Verify Account to use services");
  }
}
