const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

// GET /profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile fetched successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
