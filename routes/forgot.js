const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport({
  host: "smtp.lorenepay.com",
  port: 587,
  auth: {
    user: "verification@lorenepay.com",
    pass: process.env.MAIL_PASS,
  },
});

const mailOptions = {
  from: "verification@lorenepay.com",
  to: "verification@lorenepay.com",
  subject: "sup b",
  text: "?",
};

transporter.sendMail(mailOptions, (error, info) => {
  console.log("sending...");
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
