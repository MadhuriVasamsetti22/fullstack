const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set EJS as the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));

// ✅ Homepage route
app.get("/", (req, res) => {
  res.render("home");
});

// ✅ Import and use auth routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// Start the server
const PORT = 3000;  
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
