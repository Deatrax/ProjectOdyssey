const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const User = require('../models/User'); // Import Mongoose User Model

// --- DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
    try {
        // 1. Mongo Users Count
        const userCount = await User.countDocuments();

        // 2. Supabase Counts (Countries, Cities, POIs)
        // Note: count: 'exact' is needed to get the count value
        const { count: countryCount, error: countryError } = await supabase.from('countries').select('*', { count: 'exact', head: true });
        const { count: cityCount, error: cityError } = await supabase.from('cities').select('*', { count: 'exact', head: true });
        const { count: poiCount, error: poiError } = await supabase.from('pois').select('*', { count: 'exact', head: true });

        if (countryError) throw countryError;
        if (cityError) throw cityError;
        if (poiError) throw poiError;

        res.json({
            success: true,
            data: {
                users: userCount,
                countries: countryCount,
                cities: cityCount,
                pois: poiCount
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: error.message });
    }
});

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
        res.status(500).json({ error: error.message, code: error.code });
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
        const { name, slug, description, google_place_id, latitude, longitude, country_id, population, state_province } = req.body;

        if (!name || !slug || !country_id) {
            return res.status(400).json({ error: "Name, Slug, and Country ID are required." });
        }

        const { data, error } = await supabase
            .from('cities')
            .insert({
                name, slug, description, google_place_id, latitude, longitude, country_id, population, state_province
            })
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });

    } catch (error) {
        console.error("Create City Error:", error);
        res.status(500).json({ error: error.message, code: error.code });
    }
});

router.get('/cities', async (req, res) => {
    try {
        const { country_id, search, page = 1, limit = 50 } = req.query;

        // Pagination logic
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase.from('cities')
            .select('*, countries(name)', { count: 'exact' }); // Get total count

        // Filters
        if (country_id) {
            query = query.eq('country_id', country_id);
        }
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        // Apply Pagination & Sort
        query = query.order('name')
            .range(from, parseInt(to));

        const { data, count, error } = await query;

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            success: true,
            data,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error("Fetch Cities Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/cities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('cities').delete().eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error("Delete City Error:", error);
        res.status(500).json({ error: error.message });
    }
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
        res.status(500).json({ error: error.message, code: error.code });
    }
});

router.get('/pois', async (req, res) => {
    try {
        const { search, limit = 50 } = req.query;
        let query = supabase.from('pois').select('*, cities(name), countries(name)').limit(parseInt(limit));

        if (search) {
            // Case-insensitive search on name
            query = query.ilike('name', `%${search}%`);
        }

        // Order by most recent
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error("Fetch POIs Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
