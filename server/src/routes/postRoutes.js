const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const supabase = require("../config/supabaseClient");

/**
 * POST /api/posts
 * Create a new post (blog or auto)
 * 
 * Body:
 * {
 *   type: "blog" | "auto",
 *   content: { BlockNote JSON },
 *   tripId: "uuid-from-supabase" (optional),
 *   tripName: "Trip Name" (optional)
 * }
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, content, tripId, tripName } = req.body;
    const authorId = req.user.id; // From JWT token

    // Validation
    if (!type || !content) {
      return res.status(400).json({ error: "type and content are required" });
    }

    if (!["blog", "auto"].includes(type)) {
      return res.status(400).json({ error: "type must be 'blog' or 'auto'" });
    }

    // Create post
    const post = await Post.create({
      authorId,
      type,
      content,
      tripId: tripId || null,
      tripName: tripName || null
    });

    // Populate author details
    await post.populate("authorId", "username email");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post
    });

  } catch (err) {
    console.error("POST /api/posts error:", err);
    return res.status(500).json({ error: err.message || "Failed to create post" });
  }
});

/**
 * GET /api/posts
 * Get all posts (paginated, newest first)
 * 
 * Query params:
 * - limit: number of posts per page (default: 10, max: 50)
 * - cursor: post ID to start from (for pagination)
 * - type: filter by post type ("blog" or "auto")
 * - userId: filter by author
 */
router.get("/", async (req, res) => {
  try {
    const { limit = 10, cursor, type, userId } = req.query;
    
    const parsedLimit = Math.min(parseInt(limit) || 10, 50);
    
    // Build query
    const query = {};
    if (cursor) {
      query._id = { $lt: cursor }; // Get posts older than cursor
    }
    if (type) {
      query.type = type;
    }
    if (userId) {
      query.authorId = userId;
    }

    // Fetch posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .populate("authorId", "username email");

    // Check if there are more posts
    const hasMore = posts.length === parsedLimit;
    const nextCursor = hasMore ? posts[posts.length - 1]._id : null;

    return res.json({
      success: true,
      data: posts,
      pagination: {
        hasMore,
        nextCursor
      }
    });

  } catch (err) {
    console.error("GET /api/posts error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch posts" });
  }
});

/**
 * GET /api/posts/:id
 * Get a single post by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("authorId", "username email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json({
      success: true,
      data: post
    });

  } catch (err) {
    console.error("GET /api/posts/:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch post" });
  }
});

/**
 * PUT /api/posts/:id
 * Update a post (only author can update)
 * 
 * Body:
 * {
 *   content: { BlockNote JSON },
 *   tripName: "New Trip Name" (optional)
 * }
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { content, tripName } = req.body;
    const userId = req.user.id;

    // Find post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ error: "You can only edit your own posts" });
    }

    // Update fields
    if (content) post.content = content;
    if (tripName !== undefined) post.tripName = tripName;

    await post.save();
    await post.populate("authorId", "username email");

    return res.json({
      success: true,
      message: "Post updated successfully",
      data: post
    });

  } catch (err) {
    console.error("PUT /api/posts/:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to update post" });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post (only author can delete)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    // Delete associated comments and likes
    await Comment.deleteMany({ postId: req.params.id });
    await Like.deleteMany({ postId: req.params.id });

    // Delete post
    await Post.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (err) {
    console.error("DELETE /api/posts/:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete post" });
  }
});

/**
 * GET /api/posts/user/:userId
 * Get all posts by a specific user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("authorId", "username email");

    return res.json({
      success: true,
      data: posts
    });

  } catch (err) {
    console.error("GET /api/posts/user/:userId error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch user posts" });
  }
});

/**
 * POST /api/posts/trip-update
 * Create a trip update post with progress data
 * 
 * Body:
 * {
 *   tripId: "uuid-from-supabase",
 *   tripName: "Trip Name",
 *   tripProgress: {
 *     locations: [
 *       {
 *         name: "Location A",
 *         placeId: "ChIJ...",
 *         visitedAt: "2024-01-01T10:00:00Z",
 *         photos: ["url1", "url2"],
 *         isCurrentLocation: true
 *       }
 *     ],
 *     currentLocationName: "Location A",
 *     totalLocations: 5,
 *     completionPercentage: 40
 *   }
 * }
 */
router.post("/trip-update", authMiddleware, async (req, res) => {
  try {
    const { tripId, tripName, tripProgress } = req.body;
    const authorId = req.user.id;

    // Validation
    if (!tripId || !tripName || !tripProgress) {
      return res.status(400).json({ 
        error: "tripId, tripName, and tripProgress are required" 
      });
    }

    // Create auto-generated content
    const content = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: `Trip Update: ${tripName}`
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `I've visited ${tripProgress.locations?.length || 0} locations on my journey! Currently at ${tripProgress.currentLocationName}.`
            }
          ]
        }
      ]
    };

    // Create trip update post
    const post = await Post.create({
      authorId,
      type: "auto",
      content,
      tripId,
      tripName,
      tripProgress
    });

    // Populate author details
    await post.populate("authorId", "username email");

    return res.status(201).json({
      success: true,
      message: "Trip update post created successfully",
      data: post
    });

  } catch (err) {
    console.error("POST /api/posts/trip-update error:", err);
    return res.status(500).json({ error: err.message || "Failed to create trip update" });
  }
});

/**
 * POST /api/posts/review-share
 * Create a feed post from a place review.
 *
 * Two ways to call:
 *
 * Option A — share an existing Supabase review by ID:
 *   { "reviewId": "<uuid>" }
 *
 * Option B — supply review fields directly (creates a Supabase review first, then posts):
 *   {
 *     "placeName": "Eiffel Tower",
 *     "rating": 5,
 *     "title": "Breathtaking!",    // optional
 *     "comment": "The view is amazing",
 *     "images": ["https://..."],  // optional
 *     "placeType": "POI"           // optional, default "POI"
 *   }
 */
router.post("/review-share", authMiddleware, async (req, res) => {
  try {
    const authorId = req.user.id;
    const { reviewId, placeName, rating, title, comment, images, placeType } = req.body;

    let reviewData = {};

    if (reviewId) {
      // ── Option A: pull existing review from Supabase ──────────────────────
      const { data: review, error } = await supabase
        .from("reviews")
        .select("*, review_images(url)")
        .eq("id", reviewId)
        .single();

      if (error || !review) {
        return res.status(404).json({ error: "Review not found" });
      }

      reviewData = {
        reviewId: review.id,
        placeName: review.place_name,
        placeType: review.place_type || "POI",
        rating: review.rating,
        title: review.title || null,
        comment: review.comment || null,
        images: (review.review_images || []).map(img => img.url),
        visitDate: review.visit_date ? new Date(review.visit_date) : null
      };

    } else {
      // ── Option B: direct fields ────────────────────────────────────────────
      if (!placeName) {
        return res.status(400).json({ error: "Either reviewId or placeName is required" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "rating must be between 1 and 5" });
      }

      reviewData = {
        reviewId: null,
        placeName,
        placeType: placeType || "POI",
        rating: Number(rating),
        title: title || null,
        comment: comment || null,
        images: Array.isArray(images) ? images : [],
        visitDate: null
      };
    }

    // ── Build star string (e.g. "⭐⭐⭐⭐⭐") ──────────────────────────────
    const stars = "⭐".repeat(reviewData.rating) + "☆".repeat(5 - reviewData.rating);

    // ── Auto-generate BlockNote content ───────────────────────────────────
    const contentBlocks = [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: `Review: ${reviewData.placeName}  ${stars}`
          }
        ]
      }
    ];

    if (reviewData.title) {
      contentBlocks.push({
        type: "paragraph",
        content: [{ type: "text", text: `"${reviewData.title}"`, marks: [{ type: "italic" }] }]
      });
    }

    if (reviewData.comment) {
      contentBlocks.push({
        type: "paragraph",
        content: [{ type: "text", text: reviewData.comment }]
      });
    }

    contentBlocks.push({
      type: "paragraph",
      content: [{ type: "text", text: `📍 ${reviewData.placeName}  •  Rated ${reviewData.rating}/5` }]
    });

    const content = { type: "doc", content: contentBlocks };

    // ── Create the post ────────────────────────────────────────────────────
    const post = await Post.create({
      authorId,
      type: "review",
      content,
      reviewData
    });

    await post.populate("authorId", "username email");

    return res.status(201).json({
      success: true,
      message: "Review shared to feed successfully",
      data: post
    });

  } catch (err) {
    console.error("POST /api/posts/review-share error:", err);
    return res.status(500).json({ error: err.message || "Failed to share review" });
  }
});

module.exports = router;
