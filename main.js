if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const dbURI = process.env.DB_URL;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const Grid = require("gridfs-stream");
const User = require("./models/user");
const rateLimit = require("express-rate-limit");

// DB CONNECTION
async function connectDB() {
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}
connectDB();

// GRIDFS SETTINGS
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: "Too many requests, please wait",
});

// SETTINGS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(limiter);

// ROUTES
// Auth
app.use("/auth", checkNotAuthenticated, require("./routes/auth"));

// Logout
app.get("/logout", checkAuthenticated, (req, res) => {
  res.clearCookie("auth-token").redirect("/auth");
});

// change-pw
app.use("/change-pw", checkAuthenticated, require("./routes/change-pw"));

// Pages
app.use("/pages", checkAuthenticated, require("./routes/pages"));

// Tax
app.use("/tax", checkAuthenticated, require("./routes/tax"));

// Settings
app.use("/settings", checkAuthenticated, require("./routes/settings"));

// Settings
app.use("/account", checkAuthenticated, require("./routes/account"));

// Customers
app.use("/customers", checkAuthenticated, require("./routes/customers"));

// Payment-links
app.use("/paylinks", checkAuthenticated, require("./routes/payment-links"));

// Invoices
app.use("/invoices", checkAuthenticated, require("./routes/invoices"));

// Proforma
app.use("/proforma", checkAuthenticated, require("./routes/proforma"));

// Quotations
app.use("/quotations", checkAuthenticated, require("./routes/quotations"));

// Transactions
app.use("/transactions", checkAuthenticated, require("./routes/transactions"));

// Settlements
app.use("/settlements", checkAuthenticated, require("./routes/settlements"));

// Imgs
app.get("/img/:filename", async (req, res) => {
  try {
    let file = await gfs.files.findOne({ filename: req.params.filename });
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  } catch (err) {
    res.send(err);
  }
});

// Send Message
app.use("/send", require("./routes/send"));

// Dashboard
app.use("/dashboard", checkAuthenticated, require("./routes/dash"));

// Admin
app.use("/admin", require("./routes/admin/admin"));

// About
app.use("/", require("./routes/about"));

// ERRORS
app.get("/err", (req, res) => {
  res.json({ Error: "Some error has occurred" });
});
app.get("*", (req, res) => {
  res.render("404");
});

// MIDDLEWARE
function checkAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    return res.redirect("/auth");
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.redirect("/auth");
      } else {
        const getUser = await User.findById(user.id);
        if (getUser) {
          req.user = user;
          next();
        } else {
          return res.redirect("/auth");
        }
      }
    });
  }
}
function checkNotAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    next();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        next();
      } else {
        const getUser = await User.findById(user.id);
        if (getUser) {
          req.user = user;
          return res.redirect("/dashboard");
        } else {
          return res.redirect("/auth");
        }
      }
    });
  }
}
