const express = require("express");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const Post    = require("../models/Post");
const Follow  = require("../models/Follow");

const router = express.Router();

/**
 * OPTIONAL AUTH MIDDLEWARE
 *
 * If a valid Bearer token is present → sets req.user (same shape as authMiddleware)
 * If no token / invalid token       → continues with req.user = undefined
 *
 * Used so public endpoints can still enrich the response with
 * "isFollowing" when the caller is logged in.
 */
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch (_) {
    // invalid token — treat as unauthenticated, don't block
  }
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/users/search
// Search for users by username or displayName
//
// Auth: optional  (if logged in, each result includes isFollowing)
//
// Query params:
//   q      (required)  search term — matched against username + displayName
//   limit  (optional)  max results, default 10, max 20
//
// Response:
//   { success, count, data: [UserResult] }
//
// UserResult (private profile):
//   { _id, username, displayName, profileImage, isPrivate: true }
//
// UserResult (public profile):
//   { _id, username, displayName, profileImage, bio, travelStyle,
//     xp, level, isPrivate: false, isFollowing }
// ─────────────────────────────────────────────────────────────────────────────
router.get("/search", optionalAuth, async (req, res) => {
  try {
    const { q, limit: limitStr } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query 'q' is required" });
    }

    const limit    = Math.min(parseInt(limitStr) || 10, 20);
    const regex    = new RegExp(q.trim(), "i");
    const callerId = req.user?.id;

    const users = await User.find({
      $or: [
        { username:    regex },
        { displayName: regex }
      ]
    })
      .select("_id username displayName profileImage bio travelStyle xp level privacy")
      .limit(limit)
      .lean();

    // Enrich each result: respect privacy + add isFollowing
    const results = await Promise.all(users.map(async (u) => {
      const isOwnProfile = u._id.toString() === callerId;

      // Private profile — return minimal stub (unless it's their own)
      if (!u.privacy?.publicProfile && !isOwnProfile) {
        return {
          _id:          u._id,
          username:     u.username,
          displayName:  u.displayName,
          profileImage: u.profileImage,
          isPrivate:    true
        };
      }

      // Check if caller follows this user
      let isFollowing = false;
      if (callerId && !isOwnProfile) {
        const doc = await Follow.findOne({
          followerId:  callerId,
          followingId: u._id
        }).lean();
        isFollowing = !!doc;
      }

      return {
        _id:          u._id,
        username:     u.username,
        displayName:  u.displayName,
        profileImage: u.profileImage,
        bio:          u.bio,
        travelStyle:  u.travelStyle,
        xp:           u.xp,
        level:        u.level,
        isPrivate:    false,
        isFollowing
      };
    }));

    return res.json({
      success: true,
      count:   results.length,
      data:    results
    });

  } catch (err) {
    console.error("GET /api/users/search error:", err);
    return res.status(500).json({ error: err.message || "Search failed" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/users/:userId
// Get a user's full public profile with aggregated stats
//
// Auth: optional  (if logged in, response includes isFollowing + isOwnProfile)
//
// Response (private profile, not own):
//   { _id, username, displayName, profileImage, isPrivate: true, isOwnProfile, isFollowing }
//
// Response (public profile):
//   {
//     _id, username, displayName, profileImage, coverImage, bio,
//     travelStyle, xp, level, privacy,
//     isPrivate:    false,
//     isOwnProfile: bool,
//     isFollowing:  bool,
//     stats: { followersCount, followingCount, postsCount },
//     recentPosts:  Post[]   (last 6 posts, empty if showTripHistory=false and not own)
//   }
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:userId", optionalAuth, async (req, res) => {
  try {
    const { userId }   = req.params;
    const callerId     = req.user?.id;
    const isOwnProfile = callerId === userId;

    const user = await User.findById(userId)
      .select("-password -weeklyRecommendations -lastRecommendationWeek -notifications -preferences")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ── Private profile guard ────────────────────────────────────────────────
    if (!user.privacy?.publicProfile && !isOwnProfile) {
      return res.json({
        success: true,
        data: {
          _id:          user._id,
          username:     user.username,
          displayName:  user.displayName,
          profileImage: user.profileImage,
          isPrivate:    true,
          isOwnProfile: false,
          isFollowing:  false
        }
      });
    }

    // ── Fetch all stats in parallel ──────────────────────────────────────────
    const [
      followersCount,
      followingCount,
      postsCount,
      recentPosts,
      followDoc
    ] = await Promise.all([
      Follow.countDocuments({ followingId: userId }),
      Follow.countDocuments({ followerId:  userId }),
      Post.countDocuments({ authorId: userId }),
      Post.find({ authorId: userId })
        .sort({ createdAt: -1 })
        .limit(6)
        .select("_id type content images reviewData createdAt likesCount commentsCount")
        .lean(),
      // Only check isFollowing if caller is logged in and viewing someone else's profile
      callerId && !isOwnProfile
        ? Follow.findOne({ followerId: callerId, followingId: userId }).lean()
        : Promise.resolve(null)
    ]);

    return res.json({
      success: true,
      data: {
        _id:          user._id,
        username:     user.username,
        displayName:  user.displayName,
        profileImage: user.profileImage,
        coverImage:   user.coverImage,
        bio:          user.bio,
        travelStyle:  user.travelStyle,
        xp:           user.xp,
        level:        user.level,
        privacy:      user.privacy,
        isPrivate:    false,
        isOwnProfile: !!isOwnProfile,
        isFollowing:  !!followDoc,
        stats: {
          followersCount,
          followingCount,
          postsCount
        },
        // Respect showTripHistory privacy — owners always see their own posts
        recentPosts: (user.privacy?.showTripHistory || isOwnProfile) ? recentPosts : []
      }
    });

  } catch (err) {
    console.error("GET /api/users/:userId error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
});

module.exports = router;
