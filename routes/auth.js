const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../firebase");

// GET: Signup Page
router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// POST: Signup Form
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRef = db.collection("users").doc(email);
    const doc = await userRef.get();
    if (doc.exists) {
      return res.render("signup", { error: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.set({
      email,
      password: hashedPassword
    });

    res.redirect("/login");
  } catch (error) {
    console.error("Signup Error:", error);
    res.render("signup", { error: "Signup failed. Try again." });
  }
});

// GET: Login Page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST: Login Form
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRef = db.collection("users").doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.render("login", { error: "Invalid email or password." });
    }

    const user = doc.data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password." });
    }

    req.session.user = email;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login Error:", error);
    res.render("login", { error: "Login failed. Try again." });
  }
});

// ✅ RESTORED: Simple Dashboard with email only
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("dashboard", {
    user: req.session.user
  });
});

// GET: Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
