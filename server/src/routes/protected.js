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

// PUT /profile - Update user preferences
router.put("/profile", protect, async (req, res) => {
  try {
    const { preferences, notifications } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update preferences
    if (preferences) {
      user.preferences = {
        currency: preferences.currency || user.preferences?.currency,
        budgetRange: preferences.budgetRange || user.preferences?.budgetRange,
        accommodation: preferences.accommodation || user.preferences?.accommodation,
        travelStyles: preferences.travelStyles || user.preferences?.travelStyles,
      };
    }

    // Update notifications
    if (notifications) {
      user.notifications = {
        emailNotifications: notifications.emailNotifications !== undefined ? notifications.emailNotifications : true,
        tripReminders: notifications.tripReminders !== undefined ? notifications.tripReminders : true,
        friendActivity: notifications.friendActivity !== undefined ? notifications.friendActivity : true,
      };
    }

    await user.save();
    console.log("✅ Profile updated for user:", req.user.id);

    res.json({
      message: "Profile updated successfully",
      user: user
    });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
