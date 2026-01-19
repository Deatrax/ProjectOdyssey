const express = require("express");
const { searchPlacesDynamic, insertPlaceFromAI } = require("../services/placeService.js");

const router = express.Router();

router.get("/places", async (req, res) => {
  try {
    const filters = req.body;
    const places = await searchPlacesDynamic(filters);
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