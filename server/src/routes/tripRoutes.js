// src/routes/tripRoutes.js

const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const ItineraryModel = require("../models/Itinerary");

/**
 * POST /api/trips/save
 * Save a new itinerary (moves from Stage 2 → Stage 3)
 * 
 * Body:
 * {
 *   tripName: "My Bangladesh Trip",
 *   selectedPlaces: [{ name, category, ... }],
 *   selectedItinerary: { title, schedule, estimatedCost },
 *   status: "draft" | "confirmed"
 * }
 */
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { tripName, selectedPlaces, selectedItinerary, status } = req.body;
    const userId = req.user.id; // From authMiddleware

    console.log("POST /api/trips/save called with:", { tripName, selectedPlaces, userId });

    if (!tripName) {
      return res.status(400).json({ error: "tripName is required" });
    }

    if (!selectedPlaces || !Array.isArray(selectedPlaces)) {
      return res.status(400).json({ error: "selectedPlaces must be an array" });
    }

    const itinerary = await ItineraryModel.createItinerary(userId, {
      tripName,
      selectedPlaces,
      selectedItinerary: selectedItinerary || null,
      status: status || "draft",
    });

    console.log("Itinerary saved successfully:", itinerary);

    return res.status(201).json({
      success: true,
      message: "Itinerary saved successfully",
      data: itinerary,
    });

  } catch (err) {
    console.error("POST /save error:", err);
    return res.status(500).json({ error: err.message || "Failed to save itinerary" });
  }
});

/**
 * POST /api/trips/collection/add
 * Add a place to "My Collection" (or create if not exists)
 */
router.post("/collection/add", authMiddleware, async (req, res) => {
  try {
    const { place } = req.body;
    const userId = req.user.id;

    if (!place || !place.name) {
      return res.status(400).json({ error: "Place data is required" });
    }

    // 1. Find existing "My Collection" itinerary — use unfiltered fetch so the collection row is visible
    const allItineraries = await ItineraryModel.getUserItinerariesUnfiltered(userId);
    let collectionTrip = allItineraries.find(t => t.status === 'collection');

    if (collectionTrip) {
      // 2. Append to existing
      const currentPlaces = Array.isArray(collectionTrip.selected_places) ? collectionTrip.selected_places : [];

      // Check for duplicates (by name or id)
      const exists = currentPlaces.some(p => p.name === place.name || (p.id && p.id === place.id));

      if (!exists) {
        const updatedPlaces = [...currentPlaces, place];
        await ItineraryModel.updateItinerary(collectionTrip.id, {
          selectedPlaces: updatedPlaces
        });
        return res.json({ success: true, message: "Added to collection", isNew: false });
      } else {
        return res.json({ success: true, message: "Already in collection", isNew: false });
      }

    } else {
      // 3. Create new "My Collection"
      await ItineraryModel.createItinerary(userId, {
        tripName: "My Collection",
        selectedPlaces: [place],
        status: "collection",
        selectedItinerary: { title: "My Personal Collection", schedule: [] }
      });
      return res.status(201).json({ success: true, message: "Collection created and place added", isNew: true });
    }

  } catch (err) {
    console.error("POST /collection/add error:", err);
    return res.status(500).json({ error: err.message || "Failed to add to collection" });
  }
});

/**
 * GET /api/trips
 * Get all itineraries for logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const itineraries = await ItineraryModel.getUserItineraries(userId);

    return res.json({
      success: true,
      data: itineraries,
    });

  } catch (err) {
    console.error("GET / error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch itineraries" });
  }
});

/**
 * GET /api/trips/:id
 * Get single itinerary by ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const itinerary = await ItineraryModel.getItineraryById(id);

    // Verify ownership
    if (itinerary.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({
      success: true,
      data: itinerary,
    });

  } catch (err) {
    console.error("GET /:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch itinerary" });
  }
});

/**
 * PUT /api/trips/:id
 * Update itinerary (edit places, change status, regenerate)
 * 
 * Body: Partial update
 * {
 *   tripName?: "Updated Name",
 *   selectedPlaces?: [...],
 *   selectedItinerary?: {...},
 *   status?: "confirmed"
 * }
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { tripName, selectedPlaces, selectedItinerary, status, trip_status } = req.body;

    // Verify ownership first
    const existing = await ItineraryModel.getItineraryById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await ItineraryModel.updateItinerary(id, {
      tripName,
      selectedPlaces,
      selectedItinerary,
      status,
      trip_status,
    });

    return res.json({
      success: true,
      message: "Itinerary updated successfully",
      data: updated,
    });

  } catch (err) {
    console.error("PUT /:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to update itinerary" });
  }
});

/**
 * DELETE /api/trips/:id
 * Delete itinerary
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership first
    const existing = await ItineraryModel.getItineraryById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await ItineraryModel.deleteItinerary(id);

    return res.json({
      success: true,
      message: "Itinerary deleted successfully",
    });

  } catch (err) {
    console.error("DELETE /:id error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete itinerary" });
  }
});

module.exports = router;
