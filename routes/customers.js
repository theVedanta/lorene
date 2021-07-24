const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const User = require("../models/user");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

router.get("/", async (req, res) => {
  const customers = await Customer.find({ user: req.user.id }).sort({
    _id: -1,
  });
  const user = await User.findById(req.user.id);
  res.render("customers/customers", {
    customers: customers,
    user: user,
    verErr: req.query.verErr,
  });
});

// Add
router.post("/add", checkVerified, async (req, res) => {
  const body = req.body;

  let address = {};
  let shippingAddress = {};
  let addressDiff;

  address = {
    line1: body.line1,
    line2: body.line2,
    city: body.city,
    zip: body.zip,
    state: body.state,
    country: body.country,
  };

  if (body.addressDiff === "diff") {
    shippingAddress = {
      line1: body.a2line1,
      line2: body.a2line2,
      city: body.a2city,
      zip: body.a2zip,
      state: body.a2state,
      country: body.a2country,
    };
    addressDiff = true;
  } else {
    shippingAddress = address;
    addressDiff = false;
  }

  const customer = {
    user: req.user.id,
    type: body.type,
    businessName: body.businessName,
    name: body.name,
    mail: body.mail,
    phone: body.phone,
    website: body.website,
    addressDiff: addressDiff,
    billingAddress: address,
    shippingAddress: shippingAddress,
  };

  try {
    await Customer.create(customer);
    res.redirect("/customers");
  } catch (err) {
    res.send(err);
  }
});

// Edit
router.get("/edit/:id", checkVerified, async (req, res) => {
  const customer = await Customer.findOne({
    user: req.user.id,
    _id: req.params.id,
  });
  const user = await User.findById(req.user.id);
  res.render("customers/edit", { customer: customer, user: user });
});
router.put("/edit/:id", checkVerified, async (req, res) => {
  const body = req.body;

  let address = {};
  let shippingAddress = {};
  let addressDiff;

  address = {
    line1: body.line1,
    line2: body.line2,
    city: body.city,
    zip: body.zip,
    state: body.state,
    country: body.country,
  };

  if (body.addressDiff === "diff") {
    shippingAddress = {
      line1: body.a2line1,
      line2: body.a2line2,
      city: body.a2city,
      zip: body.a2zip,
      state: body.a2state,
      country: body.a2country,
    };
    addressDiff = true;
  } else {
    shippingAddress = address;
    addressDiff = false;
  }

  try {
    await Customer.updateOne(
      { user: req.user.id, _id: req.params.id },
      {
        $set: {
          type: body.type,
          businessName: body.businessName,
          name: body.name,
          mail: body.mail,
          phone: body.phone,
          website: body.website,
          addressDiff: addressDiff,
          billingAddress: address,
          shippingAddress: shippingAddress,
        },
      }
    );
    res.redirect("/customers");
  } catch (err) {
    res.redirect("/err");
  }
});

module.exports = router;

// MIDDLEWARE
async function checkVerified(req, res, next) {
  const user = await User.findById(req.user.id);

  if (user.verified) {
    next();
  } else {
    res.redirect("/customers?verErr=Verify Account to use services");
  }
}
