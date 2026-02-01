const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const VisitLogModel = require("../models/VisitLog");
const VisitTrackerService = require("../services/visitTracker");

/**
 * VISIT TRACKING API ROUTES
 * 
 * Endpoints:
 * POST   /api/visits/check-in           - Start tracking a visit
 * POST   /api/visits/check-out          - End tracking a visit
 * GET    /api/visits/logs/:itineraryId  - Fetch all visits for trip
 * GET    /api/visits/current/:itineraryId - Get active visit
 * PUT    /api/visits/:visitId           - Update visit (rating, notes)
 * DELETE /api/visits/:visitId           - Skip place
 * GET    /api/visits/progress/:itineraryId - Get progress stats
 * GET    /api/visits/summary/:itineraryId  - Get trip summary
 * GET    /api/visits/user              - Get user's all visits
 */

// Middleware to protect all routes
router.use(authMiddleware);

/**
 * POST /api/visits/check-in
 * Start tracking a visit at a place
 * 
 * Request body:
 * {
 *   itineraryId: string (UUID),
 *   placeId: string,
 *   placeName: string,
 *   category: string (optional),
 *   location: { lat: number, lng: number, accuracy?: number },
 *   expectedDuration: number (optional, in seconds)
 * }
 */
router.post("/check-in", async (req, res) => {
  try {
    const { itineraryId, placeId, placeName, category, location, expectedDuration } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!itineraryId || !placeId || !placeName || !location) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: itineraryId, placeId, placeName, location",
      });
    }

    // Call service
    const result = await VisitTrackerService.handleCheckIn({
      userId,
      itineraryId,
      placeId,
      placeName,
      category,
      location,
      expectedDuration,
    });

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("POST /check-in error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/visits/check-out
 * End tracking a visit
 * 
 * Request body:
 * {
 *   visitId: string (UUID),
 *   location: { lat: number, lng: number, accuracy?: number } (optional),
 *   userRating: number (1-5, optional),
 *   notes: string (optional),
 *   photos: string[] (optional, array of URLs)
 * }
 */
router.post("/check-out", async (req, res) => {
  try {
    const { visitId, location, userRating, notes, photos } = req.body;

    if (!visitId) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: visitId",
      });
    }

    // Call service
    const result = await VisitTrackerService.handleCheckOut(visitId, {
      location,
      userRating,
      notes,
      photos,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("POST /check-out error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/visits/logs/:itineraryId
 * Get all visit logs for an itinerary
 * 
 * Query params: page=1, pageSize=50
 */
router.get("/logs/:itineraryId", async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const { page = 1, pageSize = 50 } = req.query;

    const visits = await VisitLogModel.getItineraryVisits(itineraryId, {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    return res.status(200).json({
      success: true,
      data: visits,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: visits.length,
      },
    });
  } catch (err) {
    console.error("GET /logs/:itineraryId error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/visits/current/:itineraryId
 * Get currently active visit for an itinerary
 */
router.get("/current/:itineraryId", async (req, res) => {
  try {
    const { itineraryId } = req.params;

    const currentVisit = await VisitLogModel.getCurrentVisit(itineraryId);

    if (!currentVisit) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No active visit",
      });
    }

    return res.status(200).json({
      success: true,
      data: currentVisit,
    });
  } catch (err) {
    console.error("GET /current/:itineraryId error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/visits/progress/:itineraryId
 * Get visit progress statistics for an itinerary
 */
router.get("/progress/:itineraryId", async (req, res) => {
  try {
    const { itineraryId } = req.params;

    const progress = await VisitLogModel.getProgress(itineraryId);

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    console.error("GET /progress/:itineraryId error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/visits/summary/:itineraryId
 * Get comprehensive trip summary with all visits
 */
router.get("/summary/:itineraryId", async (req, res) => {
  try {
    const { itineraryId } = req.params;

    const summary = await VisitLogModel.getTripSummary(itineraryId);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    console.error("GET /summary/:itineraryId error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/visits/user
 * Get all visits for logged-in user
 * 
 * Query params: page=1, pageSize=50
 */
router.get("/user", async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 50 } = req.query;

    const visits = await VisitLogModel.getUserVisits(userId, {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    return res.status(200).json({
      success: true,
      data: visits,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: visits.length,
      },
    });
  } catch (err) {
    console.error("GET /user error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * PUT /api/visits/:visitId
 * Update visit with feedback (rating, notes, photos)
 * 
 * Request body:
 * {
 *   userRating: number (1-5, optional),
 *   notes: string (optional),
 *   photos: string[] (optional)
 * }
 */
router.put("/:visitId", async (req, res) => {
  try {
    const { visitId } = req.params;
    const { userRating, notes, photos } = req.body;

    const result = await VisitTrackerService.addFeedback(visitId, {
      userRating,
      notes,
      photos,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("PUT /:visitId error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * DELETE /api/visits/:visitId
 * Skip a place (mark visit as skipped)
 * 
 * Request body (optional):
 * {
 *   reason: string (optional)
 * }
 */
router.delete("/:visitId", async (req, res) => {
  try {
    const { visitId } = req.params;
    const { reason } = req.body;

    const result = await VisitTrackerService.skipPlace(visitId, reason);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("DELETE /:visitId error:", err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
