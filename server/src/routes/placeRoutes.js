const express = require("express");
const supabase = require("../config/supabaseClient");
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

// Public GET Single Place
router.get("/places/:id", async (req, res) => {
  const { data, error } = await supabase.from('places').select('*, cities(name), countries(name)').eq('place_id', req.params.id).single();
  if (error) return res.status(404).json({ error: "Not Found" });
  res.json(data);
});

// Public GET Single City
router.get("/cities/:id", async (req, res) => {
  const { data, error } = await supabase.from('cities').select('*, countries(name)').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: "Not Found" });
  res.json(data);
});

// Public GET Single Country
router.get("/countries/:id", async (req, res) => {
  const { data, error } = await supabase.from('countries').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: "Not Found" });
  res.json(data);
});

module.exports = router;