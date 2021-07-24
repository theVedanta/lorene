const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Customer = require("../models/customer");
const Tax = require("../models/tax");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
const Invoice = require("../models/invoice");
const Proforma = require("../models/proforma");
const Quotation = require("../models/quotation");
const uniqid = require("uniqid");
const fs = require("fs");
const createInvoice = require("./invoice-lib/createInvoice.js");

// GET invoices
router.get("/", async (req, res) => {
  const invoices = await Invoice.find({ user: req.user.id }).sort({ _id: -1 });
  const user = await User.findById(req.user.id);
  res.render("invoices/display", {
    invoices: invoices,
    user: user,
    verErr: req.query.verErr,
  });
});

// Add an Invoice
router.get("/add", checkVerified, async (req, res) => {
  const user = await User.findById(req.user.id);
  const custs = await Customer.find({ user: req.user.id });
  const taxes = await Tax.find({ user: req.user.id, active: true });

  res.render("invoices/add", {
    user: user,
    custs: custs,
    taxes: taxes,
    message: "",
  });
});

router.post("/add", checkVerified, async (req, res) => {
  const body = req.body;

  let paymodes = [];

  const invoices = await Invoice.find({ user: req.user.id });
  const invNr = `inv_${invoices.length + 1}`;

  let total = 0;
  let totalTax = 0;
  let subTot = 0;
  let discount = 0;
  let tax = 0;
  let taxObj = {};
  let items = [];

  if (!Array.isArray(body.itemName)) {
    subTot = parseInt(body.itemPrice) * parseInt(body.itemQuantity);
    discount = (parseInt(body.discount) / 100) * subTot;

    let item = {
      name: body.itemName,
      quantity: body.itemQuantity,
      price: body.itemPrice,
      description: body.itemDescription,
    };

    items.push(item);
  } else {
    for (let i = 0; i < body.itemPrice.length; i++) {
      subTot += parseInt(body.itemPrice[i]) * parseInt(body.itemQuantity[i]);
      discount = (parseInt(body.discount) / 100) * subTot;

      let item = {
        name: body.itemName[i],
        quantity: body.itemQuantity[i],
        price: body.itemPrice[i],
        description: body.itemDescription[i],
      };

      items.push(item);
    }
  }

  if (body.tax) {
    if (Array.isArray(body.tax)) {
      for (let taxe of body.tax) {
        totalTax += parseInt(taxe);
        let orignialTax = await Tax.findOne({
          user: req.user.id,
          offer: parseInt(taxe),
          active: true,
        });

        taxObj[orignialTax.name] = orignialTax.offer;
      }
    } else {
      totalTax = parseInt(body.tax);
      let orignialTax = await Tax.findOne({
        user: req.user.id,
        offer: parseInt(body.tax),
        active: true,
      });

      taxObj[orignialTax.name] = orignialTax.offer;
    }
    tax = (totalTax / 100) * (subTot - discount);
  } else {
    tax = 0;
  }

  total = subTot - discount + tax;

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

  const cust = await Customer.findById(req.body.cust);
  const customer = {
    _id: cust._id,
    user: cust.user,
    type: cust.type,
    businessName: cust.businessName,
    name: cust.name,
    company: cust.company,
    mail: cust.mail,
    phone: cust.phone,
    website: cust.website,
    billingAddress: cust.billingAddress,
    shippingAddress: cust.shippingAddress,
    addressDiff: cust.addressDiff,
  };

  let invoice = {
    user: req.user.id,
    name: body.name,
    summary: body.summary,
    invoiceNumber: body.invoiceNumber ? body.invoiceNumber : invNr,
    invoiceID: uniqid("inv-"),
    date: new Date(body.date),
    due: new Date(body.due),
    discount: body.discount,
    tax: totalTax,
    subTotal: subTot,
    total: total,
    taxObj: taxObj,
    items: items,
    customer: customer,
    paymodes: paymodes,
    gst: body.gst ? user.gst : null,
    status: "unpaid",
  };

  try {
    await Invoice.create(invoice);
    if (body.move) {
      await Proforma.deleteOne({ user: req.user.id, _id: body.move });
      await Quotation.deleteOne({ user: req.user.id, _id: body.move });
    }
    res.redirect("/invoices");
  } catch (err) {
    res.redirect("/err");
  }
});

// DELETE
router.get("/delete/:id", checkVerified, async (req, res) => {
  try {
    await Invoice.deleteOne({
      user: req.user.id,
      _id: req.params.id,
    });
    return res.redirect("/invoices");
  } catch (err) {
    return res.redirect("/err");
  }
});

// View
router.get("/view/:id", checkVerified, async (req, res) => {
  const invoice = await Invoice.findOne({ invoiceID: req.params.id });
  const cust = invoice.customer;
  const user = await User.findById(invoice.user);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  res.render("invoices/view", {
    invoice: invoice,
    cust: cust,
    user: user,
    months: monthNames,
  });
});

// edit
router.get("/edit/:id", checkVerified, async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    user: req.user.id,
    status: "unpaid",
  });
  const user = await User.findById(req.user.id);
  const custs = await Customer.find({ user: req.user.id });
  const taxes = await Tax.find({ user: req.user.id, active: true });
  const invCust = await Customer.findById(invoice.customer);

  try {
    return res.render("invoices/edit", {
      user: user,
      invoice: invoice,
      custs: custs,
      taxes: taxes,
      invCust: invCust,
      edit: true,
      message: "",
    });
  } catch (err) {
    res.redirect("/err");
  }
});
router.put("/edit/:id", checkVerified, async (req, res) => {
  const body = req.body;

  let paymodes = [];

  let total = 0;
  let totalTax = 0;
  let subTot = 0;
  let discount = 0;
  let tax = 0;
  let taxObj = {};
  let items = [];

  if (!Array.isArray(body.itemName)) {
    subTot = parseInt(body.itemPrice) * parseInt(body.itemQuantity);
    discount = (parseInt(body.discount) / 100) * subTot;

    let item = {
      name: body.itemName,
      quantity: body.itemQuantity,
      price: body.itemPrice,
      description: body.itemDescription,
    };

    items.push(item);
  } else {
    for (let i = 0; i < body.itemPrice.length; i++) {
      subTot += parseInt(body.itemPrice[i]) * parseInt(body.itemQuantity[i]);
      discount = (parseInt(body.discount) / 100) * subTot;

      let item = {
        name: body.itemName[i],
        quantity: body.itemQuantity[i],
        price: body.itemPrice[i],
        description: body.itemDescription[i],
      };

      items.push(item);
    }
  }

  if (body.tax) {
    if (Array.isArray(body.tax)) {
      for (let taxe of body.tax) {
        totalTax += parseInt(taxe);
        let orignialTax = await Tax.findOne({
          user: req.user.id,
          offer: parseInt(taxe),
          active: true,
        });

        taxObj[orignialTax.name] = orignialTax.offer;
      }
    } else {
      totalTax = parseInt(body.tax);
      let orignialTax = await Tax.findOne({
        user: req.user.id,
        offer: parseInt(body.tax),
        active: true,
      });

      taxObj[orignialTax.name] = orignialTax.offer;
    }
    tax = (totalTax / 100) * (subTot - discount);
  } else {
    tax = 0;
  }

  total = subTot - discount + tax;

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

  const cust = await Customer.findById(req.body.cust);
  const customer = {
    _id: cust._id,
    user: cust.user,
    type: cust.type,
    businessName: cust.businessName,
    name: cust.name,
    company: cust.company,
    mail: cust.mail,
    phone: cust.phone,
    website: cust.website,
    billingAddress: cust.billingAddress,
    shippingAddress: cust.shippingAddress,
    addressDiff: cust.addressDiff,
  };

  try {
    await Invoice.updateOne(
      { _id: req.params.id, user: req.user.id, status: "unpaid" },
      {
        $set: {
          name: body.name,
          summary: body.summary,
          invoiceNumber: body.invoiceNumber ? body.invoiceNumber : "",
          date: new Date(body.date),
          due: new Date(body.due),
          discount: body.discount,
          tax: totalTax,
          subTotal: subTot,
          total: total,
          taxObj: taxObj,
          items: items,
          customer: customer,
          paymodes: paymodes,
          gst: body.gst ? user.gst : null,
        },
      }
    );
    res.redirect("/invoices");
  } catch (err) {
    res.redirect("/err");
  }
});

// Record a Payment
router.put("/record/:id", checkVerified, async (req, res) => {
  const body = req.body;

  try {
    await Invoice.updateOne(
      { _id: req.params.id, user: req.user.id, status: "unpaid" },
      {
        $set: {
          paymentDate: new Date(body.date),
          status: "paid",
        },
      }
    );
    res.redirect("/invoices");
  } catch (err) {
    res.redirect("/err");
  }
});

// Duplicate
router.get("/duplicate/:id", checkVerified, async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  const user = await User.findById(req.user.id);
  const custs = await Customer.find({ user: req.user.id });
  const taxes = await Tax.find({ user: req.user.id, active: true });
  const invCust = invoice.customer;

  res.render("invoices/edit", {
    user: user,
    invoice: invoice,
    custs: custs,
    taxes: taxes,
    invCust: invCust,
    edit: false,
    message: "",
  });
});

// Download
router.post("/download/:id", async (req, res) => {
  const invoice = await Invoice.findOne({
    invoiceID: req.params.id,
  });
  const cust = invoice.customer;
  const user = await User.findById(invoice.user);

  if (cust !== null) {
    let items = [];
    for (let item of invoice.items) {
      const obj = {
        item: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
      };
      items.push(obj);
    }

    const inv = {
      name: invoice.name,
      summary: invoice.summary,
      shipping: {
        name: cust.businessName,
        address: `${cust.billingAddress.line1} ${cust.billingAddress.line2}`,
        city: cust.billingAddress.city,
        state: cust.billingAddress.state,
        country: cust.billingAddress.country,
        postal_code: cust.billingAddress.zip,
      },
      sender: {
        name: user.name,
        address: `${user.address.line1}, ${user.address.line2}`,
        state: `${user.address.zip}, ${user.address.state}`,
      },
      date: `${invoice.date.getDate()}/${invoice.date.getMonth()}/${invoice.date.getFullYear()}`,
      due: `${invoice.due.getDate()}/${invoice.due.getMonth()}/${invoice.due.getFullYear()}`,
      items: items,
      subtotal: invoice.subTotal,
      discount: invoice.discount,
      taxObj: invoice.taxObj,
      invoice_nr: invoice.invoiceNumber,
      total: invoice.total,
      paid: invoice.status === "paid" ? true : false,
    };

    createInvoice(inv, `${invoice.invoiceID}.pdf`);
    res.redirect(`/invoices/save/${invoice.invoiceID}`);
  } else {
    res.redirect("/err?customer deleted or not found, could not download");
  }
});
router.get("/save/:id", async (req, res) => {
  await res.download(`${req.params.id}.pdf`, (err) => {
    if (err) {
      console.log(err);
      fs.unlink(`${req.params.id}.pdf`, () => {});
      return res.redirect("/err");
    } else {
      fs.unlink(`${req.params.id}.pdf`, () => {});
    }
  });
});

// User invoice View
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceID: req.params.id });
    if (!invoice) {
      return res.redirect("/404");
    } else {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const user = await User.findById(invoice.user);
      const cust = await Customer.findById(invoice.customer);
      return res.render("invoices/invoice", {
        invoice: invoice,
        user: user,
        cust: cust,
        months: monthNames,
      });
    }
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
    res.redirect("/invoices?verErr=Verify Account to use services");
  }
}
