const express = require("express");
const { searchPlacesDynamic, insertPlaceFromAI, getTrendingPlaces } = require("../services/placeService.js");

const router = express.Router();

router.get("/places", async (req, res) => {
  try {
    // Merge query params and body for flexibility (though GET body is rare)
    const filters = { ...req.query, ...req.body };
    const places = await searchPlacesDynamic(filters);
    res.json({ source: "db", places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/places/trending", async (req, res) => {
  try {
    const { country } = req.query; // Optional: user's country for localization
    const places = await getTrendingPlaces(country);
    res.json({ source: "db", places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/places", async (req, res) => {
  try {
    const result = await insertPlaceFromAI(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;