const GeofenceService = require("../services/geofenceService");
const VisitLog = require("../models/VisitLog");
const authMiddleware = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");
const router = require("express").Router();

/**
 * POST /api/visits/geofence-check
 * Check if user is within any geofence and auto check-in/out if applicable
 */
router.post("/geofence-check", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, itineraryId } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude || !itineraryId) {
      return res.status(400).json({ error: "Missing coordinates or itinerary" });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

    const geofenceStatus = await GeofenceService.checkGeofenceStatus(
      userId,
      latitude,
      longitude,
      itineraryId
    );

    // If within geofence and auto-checkin enabled, perform auto check-in
    if (geofenceStatus.isInGeofence) {
      const settings = await GeofenceService.getUserGeofenceSettings(userId);
      if (settings.auto_checkin) {
        const checkInResult = await GeofenceService.autoCheckIn(
          userId,
          itineraryId,
          geofenceStatus.place,
          geofenceStatus.distance,
          { latitude, longitude }
        );
        return res.json({ ...geofenceStatus, ...checkInResult });
      }
    }

    res.json(geofenceStatus);
  } catch (error) {
    console.error("Geofence check error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/visits/check-in
 * Manual check-in to a place
 */
router.post("/check-in", authMiddleware, async (req, res) => {
  try {
    const { itineraryId, placeId, placeName, expectedDuration } = req.body;
    const userId = req.user.id;

    if (!itineraryId || !placeId || !placeName) {
      return res.status(400).json({ error: "Missing required fields: itineraryId, placeId, placeName" });
    }

    const result = await GeofenceService.manualCheckIn(
      userId,
      itineraryId,
      placeId,
      placeName,
      expectedDuration || 60
    );

    res.json(result);
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/visits/check-out
 * Manual check-out from a place
 */
router.post("/check-out", authMiddleware, async (req, res) => {
  try {
    const { visitLogId, userRating, notes } = req.body;
    const userId = req.user.id;

    if (!visitLogId) {
      return res.status(400).json({ error: "Missing visitLogId" });
    }

    // Validate ownership
    const visit = await VisitLog.getById(visitLogId);
    if (visit.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const result = await GeofenceService.manualCheckOut(visitLogId, userRating, notes);

    res.json(result);
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/visits/skip
 * Skip a place in the itinerary
 */
router.post("/skip", authMiddleware, async (req, res) => {
  try {
    const { itineraryId, placeId, placeName } = req.body;
    const userId = req.user.id;

    if (!itineraryId || !placeId || !placeName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await GeofenceService.skipPlace(userId, itineraryId, placeId, placeName);

    res.json(result);
  } catch (error) {
    console.error("Skip place error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/visits/logs/:itineraryId
 * Get all visit logs for an itinerary
 */
router.get("/logs/:itineraryId", authMiddleware, async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user.id;

    // Validate itinerary ownership
    const { data: itinerary, error: itineraryError } = await supabase
      .from("itineraries")
      .select("user_id")
      .eq("id", itineraryId)
      .single();

    if (itineraryError || !itinerary || itinerary.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const logs = await VisitLog.getByItinerary(itineraryId, { limit: 1000 });

    res.json({
      itineraryId,
      visitLogs: logs,
    });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/visits/current/:itineraryId
 * Get current active visit for an itinerary
 */
router.get("/current/:itineraryId", authMiddleware, async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user.id;

    // Validate itinerary ownership
    const { data: itinerary, error: itineraryError } = await supabase
      .from("itineraries")
      .select("user_id")
      .eq("id", itineraryId)
      .single();

    if (itineraryError || !itinerary || itinerary.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const currentVisit = await VisitLog.getCurrentVisit(userId, itineraryId);

    res.json({ currentVisit });
  } catch (error) {
    console.error("Get current visit error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/visits/stats/:itineraryId
 * Get visit statistics for an itinerary
 */
router.get("/stats/:itineraryId", authMiddleware, async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const userId = req.user.id;

    // Validate itinerary ownership
    const { data: itinerary, error: itineraryError } = await supabase
      .from("itineraries")
      .select("user_id")
      .eq("id", itineraryId)
      .single();

    if (itineraryError || !itinerary || itinerary.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const stats = await VisitLog.getStats(itineraryId);

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/visits/:visitLogId
 * Delete a visit log
 */
router.delete("/:visitLogId", authMiddleware, async (req, res) => {
  try {
    const { visitLogId } = req.params;
    const userId = req.user.id;

    // Validate ownership
    const visit = await VisitLog.getById(visitLogId);
    if (visit.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await VisitLog.delete(visitLogId);

    res.json({ success: true, message: "Visit log deleted" });
  } catch (error) {
    console.error("Delete visit error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/visits/configure-geofence
 * User can customize geofence radius (50m - 500m)
 */
router.post("/configure-geofence", authMiddleware, async (req, res) => {
  try {
    const { radius, autoCheckin, autoCheckout } = req.body;
    const userId = req.user.id;

    if (!radius || radius < 50 || radius > 500) {
      return res.status(400).json({ error: "Radius must be between 50-500 meters" });
    }

    // Try to update existing, or create if doesn't exist
    const { data: existing } = await supabase
      .from("geofence_settings")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("geofence_settings")
        .update({
          geofence_radius: radius,
          auto_checkin: autoCheckin !== false,
          auto_checkout: autoCheckout !== false,
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    } else {
      const { data, error } = await supabase
        .from("geofence_settings")
        .insert({
          user_id: userId,
          geofence_radius: radius,
          auto_checkin: autoCheckin !== false,
          auto_checkout: autoCheckout !== false,
        })
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }
  } catch (error) {
    console.error("Configure geofence error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/visits/settings
 * Get user's current geofence settings
 */
router.get("/settings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const settings = await GeofenceService.getUserGeofenceSettings(userId);

    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
