const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,  // Allow null for OAuth-only users
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.auth_method === "manual";  // Only required for manual auth
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  dob: {
    type: Date, 
    required: function() {
      return this.auth_method === "manual";  // Only required for manual auth
    }
  },
  // OAuth fields
  google_id: {
    type: String,
    unique: true,
    sparse: true
  },
  auth_method: {
    type: String,
    enum: ["manual", "google"],
    default: "manual"
  },
  image: String,  // Profile picture from Google
  emailVerified: {
    type: Boolean,
    default: function() {
      return this.auth_method === "google";  // Auto-verify Google users
    }
  },
  // User Preferences
  preferences: {
    currency: {
      type: String,
      default: "USD"
    },
    budgetRange: {
      type: String,
      default: "$50 - $100 (Moderate)"
    },
    accommodation: {
      type: String,
      default: "Mid-range Hotels"
    },
    travelStyles: {
      type: [String],
      default: []
    }
  },
  // Notification Settings
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    tripReminders: {
      type: Boolean,
      default: true
    },
    friendActivity: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Hash password before saving (only for manual auth)
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
