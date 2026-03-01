const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const placeService = require('../src/services/placeService');

async function testQuery() {
    const results = await placeService.searchPlacesDynamic({ search_query: 'Louvre Museum' });
    console.log("Search Results with images:", JSON.stringify(results, null, 2));
}

testQuery();
