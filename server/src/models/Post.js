const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["blog", "auto"],
    required: true,
    default: "blog"
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // BlockNote JSON structure
    required: true
  },
  tripId: {
    type: String, // UUID from Supabase itineraries table
    default: null
  },
  tripName: {
    type: String,
    default: null
  },
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Virtual field to populate author details
postSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true
});

// Include virtuals in JSON
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);
