const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const placeService = require('../src/services/placeService');

async function testSeed() {
    try {
        // Try to seed images for Lalbagh Fort or similar
        // Looking at the console error URL: /api/admin/places/23/seed-images
        const result = await placeService.seedImagesForPlace(23, 'POI');
        console.log("Seed result:", result);
    } catch (err) {
        console.error("Test failed:", err.message);
    }
}

testSeed();
