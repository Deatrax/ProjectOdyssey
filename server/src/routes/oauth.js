const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Redirect to Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Step 2: Google callback (Google redirects here)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login?error=auth_failed" }),
  (req, res) => {
    // User is now authenticated by Passport
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create user object to pass to frontend
    const userData = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      image: req.user.image,
      auth_method: req.user.auth_method
    };

    // Redirect to frontend with token in query params
    res.redirect(
      `http://localhost:3000/dashboard?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(userData))}`
    );
  }
);

module.exports = router;
