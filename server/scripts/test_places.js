const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SB_PROJECT_URL, process.env.SB_SERVICE_ROLE_KEY || process.env.SB_API_KEY);

async function testQuery() {
    const { data: places } = await supabase.from('places').select('place_id, name, google_place_id').limit(5);
    console.log("Places:", places);
}

testQuery();
