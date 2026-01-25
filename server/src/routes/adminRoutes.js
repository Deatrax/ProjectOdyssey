const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// --- COUNTRIES ---
router.post('/countries', async (req, res) => {
    try {
        const { name, slug, description, google_place_id, latitude, longitude, country_code, continent, population, currency } = req.body;

        // Basic validation
        if (!name || !slug || !country_code) {
            return res.status(400).json({ error: "Name, Slug, and Country Code are required." });
        }

        const { data, error } = await supabase
            .from('countries')
            .insert({
                name, slug, description, google_place_id, latitude, longitude, country_code, continent, population, currency
            })
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });

    } catch (error) {
        console.error("Create Country Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/countries', async (req, res) => {
    const { data, error } = await supabase.from('countries').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});


// --- CITIES (DISTRICTS) ---
router.post('/cities', async (req, res) => {
    try {
        const { name, slug, description, google_place_id, latitude, longitude, country_id, population } = req.body;

        if (!name || !slug || !country_id) {
            return res.status(400).json({ error: "Name, Slug, and Country ID are required." });
        }

        const { data, error } = await supabase
            .from('cities')
            .insert({
                name, slug, description, google_place_id, latitude, longitude, country_id, population
            })
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });

    } catch (error) {
        console.error("Create City Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/cities', async (req, res) => {
    // Can filter by country_id if query param provided
    const { country_id } = req.query;
    let query = supabase.from('cities').select('*').order('name');

    if (country_id) {
        query = query.eq('country_id', country_id);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});


// --- POIS ---
router.post('/pois', async (req, res) => {
    try {
        const { name, slug, description, google_place_id, latitude, longitude, city_id, country_id, category, address } = req.body;

        if (!name || !slug || !city_id || !country_id) {
            return res.status(400).json({ error: "Name, Slug, City ID, and Country ID are required." });
        }

        const { data, error } = await supabase
            .from('pois')
            .insert({
                name, slug, description, google_place_id, latitude, longitude, city_id, country_id, category, address
            })
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });

    } catch (error) {
        console.error("Create POI Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
