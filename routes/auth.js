const express = require("express");
const router = express.Router();
const emailExistence = require("email-existence");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const UnAuthUser = require("../models/unAuthUser");
const ForgotOtp = require("../models/forgotOtp");

const transporter = nodemailer.createTransport({
  host: "us2.smtp.mailhostbox.com",
  secure: false,
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1",
  },
  port: 25,
  auth: {
    user: "verification@lorenepay.com",
    pass: process.env.MAIL_PASS,
  },
});

router.get("/", (req, res) => {
  res.render("auth/auth", {
    loginErr: req.query.loginErr,
    regisErr: req.query.regisErr,
  });
});

router.post("/register", async (req, res) => {
  const body = req.body;

  emailExistence.check(body.mail, async (err, data) => {
    if (data === false) {
      return res.redirect("/auth?regisErr=Not a Valid Email");
    } else {
      if (body.password.length < 4 || body.password.length > 50) {
        return res.redirect("/auth?regisErr=Password too short or long");
      } else if (body.phone.length !== 10) {
        return res.redirect("/auth?regisErr=Phone Number must be 10 digits");
      } else if (!passCheck(body.password)) {
        return res.redirect("/auth?regisErr=Password must have a number");
      } else {
        const uniqueMails = await User.distinct("mail");

        if (uniqueMails.includes(body.mail)) {
          return res.redirect(
            "/auth?regisErr=Email or Phone Number Already Exists"
          );
        } else {
          try {
            let password = await bcrypt.hash(body.password, 10);

            const otp = otpGenerator.generate(4, {
              alphabets: false,
              specialChars: false,
              digits: true,
              upperCase: false,
            });

            let unAuthUser = {
              name: body.name,
              mail: body.mail,
              password: password,
              phone: body.phone,
              state: body.state,
              type: body.type,
              otp: await bcrypt.hash(`${otp}`, 10),
              expired: false,
            };

            await UnAuthUser.create(unAuthUser);

            const mailOptions = {
              from: "verification@lorenepay.com",
              to: body.mail,
              subject: "Lorene Pay Verification",
              text: `Your verification code is: ${otp}`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                expireOtp(body.mail, true);
                return res.redirect("/err");
              } else {
                res.render("auth/mail-ver", { mail: body.mail, err: false });
                setTimeout(() => expireOtp(body.mail, true), 60000);
              }
            });
          } catch (err) {
            if (err.code === 11000) {
              const otp = otpGenerator.generate(4, {
                alphabets: false,
                specialChars: false,
                digits: true,
                upperCase: false,
              });

              await UnAuthUser.updateOne(
                { mail: body.mail, expired: true },
                {
                  $set: {
                    otp: await bcrypt.hash(`${otp}`, 10),
                    expired: false,
                  },
                }
              );

              const mailOptions = {
                from: "verification@lorenepay.com",
                to: body.mail,
                subject: "Lorene Pay Verification",
                text: `Your verification code is: ${otp}`,
              };

              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  expireOtp(body.mail, true);
                  return res.redirect("/err");
                } else {
                  res.render("auth/mail-ver", {
                    mail: body.mail,
                    err: "This Email is not verified, please check Email",
                  });
                  setTimeout(() => expireOtp(body.mail, true), 60000);
                }
              });
            } else {
              return res.redirect("/err");
            }
          }
        }
      }
    }
  });
});

router.post("/login", async (req, res) => {
  let body = req.body;
  const userFound = await User.findOne({ mail: body.mail });

  if (!userFound) {
    res.redirect("/auth?loginErr=No User Found");
  } else {
    let user = {
      id: userFound._id,
    };
    if (await bcrypt.compare(body.password, userFound.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "24h",
      });
      res
        .cookie("auth-token", accessToken, { maxAge: 172800000 })
        .redirect("/dashboard");
    } else {
      res.redirect("/auth?loginErr=Password Incorrect");
    }
  }
});

router.post("/ver", async (req, res) => {
  const body = req.body;

  try {
    const unAuthUser = await UnAuthUser.findOne({ mail: body.mail });

    if (!unAuthUser.expired) {
      if (await bcrypt.compare(body.otp, unAuthUser.otp)) {
        const user = {
          name: unAuthUser.name,
          mail: unAuthUser.mail,
          password: unAuthUser.password,
          phone: unAuthUser.phone,
          state: unAuthUser.state,
          type: unAuthUser.type,
          verified: false,
        };
        await User.create(user);

        let gotUser = await User.findOne({ mail: body.mail });
        let userToSign = {
          id: gotUser._id,
        };

        const accessToken = jwt.sign(
          userToSign,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "24h",
          }
        );

        await UnAuthUser.deleteOne({ mail: body.mail });
        return res
          .cookie("auth-token", accessToken, { maxAge: 172800000 })
          .json({ success: true });
      } else {
        res.json({ error: "Invalid OTP" });
      }
    } else {
      return res.json({ expired: true });
    }
  } catch (err) {
    res.redirect("/err");
  }
});

router.get("/resend", async (req, res) => {
  try {
    const otp = otpGenerator.generate(4, {
      alphabets: false,
      specialChars: false,
      digits: true,
      upperCase: false,
    });

    await UnAuthUser.updateOne(
      { mail: req.query.mail, expired: true },
      {
        $set: {
          otp: await bcrypt.hash(`${otp}`, 10),
          expired: false,
        },
      }
    );

    const mailOptions = {
      from: "verification@lorenepay.com",
      to: req.query.mail,
      subject: "Lorene Pay Verification",
      text: `Your verification code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        expireOtp(body.mail, true);
        return res.redirect("/err");
      } else {
        res.render("auth/mail-ver", {
          mail: req.query.mail,
          err: "OTP Sent Again",
        });
        setTimeout(() => expireOtp(req.query.mail, true), 60000);
      }
    });
  } catch (err) {
    res.redirect("/err");
  }
});

router.post("/forgot", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ mail: body.mail });

  if (!user) {
    return res.json({ err: "No User Found" });
  } else {
    const otp = otpGenerator.generate(10, {
      alphabets: true,
      specialChars: false,
      digits: true,
      upperCase: true,
    });

    let forgotOtp = {
      mail: body.mail,
      otp: await bcrypt.hash(`${otp}`, 10),
      expired: false,
    };

    try {
      await ForgotOtp.create(forgotOtp);

      const mailOptions = {
        from: "verification@lorenepay.com",
        to: body.mail,
        subject: "Lorene Pay Verification",
        html: `
        <center style="width: 100%; height: 60vh; background: #0275d8">
          <a
            style="
              color: #0275d8;
              background: #fff;
              padding: 1vh 1vw;
              text-decoration: none;
              font-size: 1vw;
              font-weight: 500;
              border-radius: 7px;
              height: 10vh;
            "
            href="https://lorenepay.com/auth/forgot/verify/${otp}?mail=${body.mail}"
            >Click Here to Reset your Password</a
          >
        </center>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          expireOtp(body.mail, true);
          return res.json({ err: "Error occurred while sending email" });
        } else {
          res.json({ done: true });
          setTimeout(() => expireOtp(body.mail, false), 360000);
        }
      });
    } catch (err) {
      if (err.code === 11000) {
        const otp = otpGenerator.generate(10, {
          alphabets: true,
          specialChars: false,
          digits: true,
          upperCase: true,
        });

        await ForgotOtp.updateOne(
          { mail: body.mail },
          { $set: { expired: false, otp: await bcrypt.hash(`${otp}`, 10) } }
        );

        const mailOptions = {
          from: "verification@lorenepay.com",
          to: body.mail,
          subject: "Lorene Pay Verification",
          html: `
        <div style="width: 100%; height: 60vh; background: #0275d8; display: flex; justify-content: center; align-items: center">
          <a
            style="
              color: #0275d8;
              background: #fff;
              padding: 1vh 1vw;
              text-decoration: none;
              font-size: 1vw;
              font-weight: 500;
              border-radius: 7px;
              height: 10vh;
            "
            href="https://lorenepay.com/auth/forgot/verify/${otp}?mail=${body.mail}"
            >Click Here to Reset your Password</a
          >
        </div>
        `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            expireOtp(body.mail, false);
            return res.json({ err: "Error occurred while sending email" });
          } else {
            res.json({ done: true });
            setTimeout(() => expireOtp(body.mail, false), 360000);
          }
        });
      } else {
        res.json({ err: "Some Error occurred" });
      }
    }
  }
});

router.get("/forgot/verify/:otp", async (req, res) => {
  const gotUserForOtp = await ForgotOtp.findOne({
    mail: req.query.mail,
    expired: false,
  });

  if (gotUserForOtp === null) {
    await ForgotOtp.deleteOne({
      mail: req.query.mail,
    });
    return res.redirect("/auth?loginErr=Link Expired");
  } else {
    if (await bcrypt.compare(req.params.otp, gotUserForOtp.otp)) {
      res.render("auth/reset", { mail: req.query.mail, err: false });
    }
  }
});

router.post("/forgot/reset", async (req, res) => {
  try {
    if (!req.query.mail) {
      return res.redirect("/404");
    } else {
      const body = req.body;

      if (body.password.length < 4 || body.password.length > 50) {
        return res.render(`auth/reset`, {
          mail: req.query.mail,
          err: "Password too short or long",
        });
      } else if (!passCheck(body.password)) {
        return res.render("auth/reset", {
          mail: req.query.mail,
          err: "Password must have a number",
        });
      } else {
        await User.updateOne(
          { mail: req.query.mail },
          { $set: { password: await bcrypt.hash(body.password, 10) } }
        );

        let gotUser = await User.findOne({ mail: req.query.mail });
        let userToSign = {
          id: gotUser._id,
        };

        const accessToken = jwt.sign(
          userToSign,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "24h",
          }
        );

        await ForgotOtp.deleteOne({
          mail: req.query.mail,
        });

        return res
          .cookie("auth-token", accessToken, { maxAge: 172800000 })
          .redirect("/dashboard");
      }
    }
  } catch (err) {
    return res.redirect("/err");
  }
});

// MiddleWare

function passCheck(pass) {
  let valid = false;
  for (let letter of pass) {
    if (parseInt(letter)) {
      valid = true;
    }
  }

  return valid;
}
async function expireOtp(mail, un) {
  if (un) {
    await UnAuthUser.updateOne({ mail: mail }, { $set: { expired: true } });
  } else {
    await ForgotOtp.updateOne({ mail: mail }, { $set: { expired: true } });
  }
}

module.exports = router;
