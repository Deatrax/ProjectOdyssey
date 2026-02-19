// src/routes/reviewRoutes.js

const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const ReviewModel = require("../models/Review");

/**
 * GET /api/reviews
 * Get all reviews for the logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await ReviewModel.getUserReviews(userId);

        return res.json({
            success: true,
            data: reviews,
        });
    } catch (err) {
        console.error("GET /api/reviews error:", err);
        return res.status(500).json({ error: err.message || "Failed to fetch reviews" });
    }
});

/**
 * POST /api/reviews
 * Create a new review
 *
 * Body:
 * {
 *   placeName: "Tanah Lot Temple",
 *   location: "Bali, Indonesia",
 *   rating: 5,
 *   comment: "Amazing place!",
 *   title: "Must Visit" (optional)
 * }
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const username = req.user.username;
        const { placeName, location, rating, comment, title, images } = req.body;

        if (!placeName) {
            return res.status(400).json({ error: "placeName is required" });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "rating must be between 1 and 5" });
        }

        const review = await ReviewModel.createReview(userId, username, {
            placeName,
            location,
            rating,
            comment,
            title,
            images,
        });

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (err) {
        console.error("POST /api/reviews error:", err);
        return res.status(500).json({ error: err.message || "Failed to create review" });
    }
});

/**
 * DELETE /api/reviews/:id
 * Delete a review (ownership verified)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Use deleteOwnedReview which handles UUID conversion and verification securely
        await ReviewModel.deleteOwnedReview(id, userId);

        return res.json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (err) {
        console.error("DELETE /api/reviews/:id error:", err);
        const status = err.message.includes("Unauthorized") ? 403 : 500;
        return res.status(status).json({ error: err.message || "Failed to delete review" });
    }
});

module.exports = router;
