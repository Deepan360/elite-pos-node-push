const sql = require("mssql");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const { Server } = require("http");
const uuid= require("crypto").randomUUID;
 
const app = express();
dotenv.config({ path: "./.env" });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    enableArithAbort: true, 
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Connected to SQL Server 🚁");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set("view engine", "hbs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/uploads", express.static("uploads"));


const partialspath = path.join(__dirname, "./views/partials");
hbs.registerPartials(partialspath);

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});


const pagesRouter = require("./routes/pages"); // ✅ Ensure this is a router
const authRouter = require("./routes/auth");   // ✅ Ensure this is a router
const router = require("./routes/pages");

app.use("/", pagesRouter); // ✅ Use the correct router
app.use("/auth", authRouter); // ✅ Use the correct router


// API endpoint to get user role (example)
app.get("/api/user/role", (req, res) => {
  res.json({ role: "userRoleFromDatabase" });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
});
 
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.use((req, res, next) => {
  if (!res.headersSent) {
    return req.originalUrl === "/index" && !req.isAuthenticated()
      ? res.redirect("/")
      : res.status(404).render("pagenotfound");
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started @ port 5000 🚀 ${uuid()}`);
});
