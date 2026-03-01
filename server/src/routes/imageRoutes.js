// server/src/routes/imageRoutes.js
// Admin routes for image management

const express = require('express');
const router = express.Router();
const imageService = require('../services/imageService');

/**
 * POST /api/admin/images/populate
 * Fetch images from Google Maps + Unsplash, upload to Cloudinary, save to DB
 * Body: { place_id, place_type, place_name, google_place_id? }
 */
router.post('/populate', async (req, res) => {
    try {
        const { place_id, place_type, place_name, google_place_id } = req.body;

        if (!place_id || !place_type || !place_name) {
            return res.status(400).json({ error: 'place_id, place_type, and place_name are required' });
        }

        const result = await imageService.populateImages({
            place_id,
            place_type,
            place_name,
            google_place_id,
        });

        res.json(result);
    } catch (err) {
        console.error('POST /api/admin/images/populate error:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/admin/images/:placeId
 * Get all images for a place
 */
router.get('/:placeId', async (req, res) => {
    try {
        const { placeType } = req.query;
        const images = await imageService.getImagesForPlace(req.params.placeId, placeType);
        res.json({ success: true, images });
    } catch (err) {
        console.error('GET /api/admin/images/:placeId error:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /api/admin/images/:imageId
 * Delete a single image from Cloudinary + DB
 */
router.delete('/:imageId', async (req, res) => {
    try {
        await imageService.deleteImage(req.params.imageId);
        res.json({ success: true, message: 'Image deleted' });
    } catch (err) {
        console.error('DELETE /api/admin/images/:imageId error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
