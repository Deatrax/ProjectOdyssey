const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Cloudinary implicitly configures itself via CLOUDINARY_URL in process.env
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

class ImageService {
    /**
     * Uploads an image URL to Cloudinary and returns the secure URL
     */
    async uploadToCloudinary(imageUrl, folderName = "odyssey_places") {
        try {
            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: folderName,
            });
            return result.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error.message || error);
            return null;
        }
    }

    /**
     * Fetches photo references from Google Places API using either place_id or text search
     */
    async fetchGooglePhotosForPlace(placeId, name, locationContext, limit = 10) {
        if (!GOOGLE_API_KEY) {
            console.warn("No GOOGLE_MAPS_API_KEY provided. Skipping Google Maps fetch.");
            return { urls: [], newPlaceId: null };
        }

        let resolvedPlaceId = placeId;

        try {
            // If we don't have a specific place ID, perform a text search
            if (!resolvedPlaceId) {
                const query = encodeURIComponent(`${name} ${locationContext || ''}`.trim());
                const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}`;
                const searchRes = await axios.get(searchUrl);

                if (searchRes.data.results && searchRes.data.results.length > 0) {
                    resolvedPlaceId = searchRes.data.results[0].place_id;
                } else {
                    return { urls: [], newPlaceId: null };
                }
            }

            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${resolvedPlaceId}&fields=photos&key=${GOOGLE_API_KEY}`;
            const response = await axios.get(detailsUrl);
            const photos = response.data.result?.photos || [];

            const urls = photos.slice(0, limit).map(p => {
                return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_API_KEY}`;
            });

            return { urls: urls, newPlaceId: !placeId ? resolvedPlaceId : null };
        } catch (error) {
            console.error(`Error fetching Google photos for ${name}:`, error.message);
            return { urls: [], newPlaceId: null };
        }
    }

    /**
     * Fetches photos from Unsplash based on a query
     */
    async fetchUnsplashPhotos(query, limit = 3) {
        if (!UNSPLASH_ACCESS_KEY) {
            console.warn("No UNSPLASH_ACCESS_KEY provided. Skipping Unsplash.");
            return [];
        }

        try {
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: { query, per_page: limit, orientation: 'landscape' },
                headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
            });

            return response.data.results.map(img => img.urls.regular);
        } catch (error) {
            console.error(`Error fetching Unsplash photos for ${query}:`, error.message);
            return [];
        }
    }
}

module.exports = new ImageService();
