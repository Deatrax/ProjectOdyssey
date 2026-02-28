const supabase = require("../config/supabaseClient");

/// -- ->Note for other developers working with AI -- //
async function searchPlacesDynamic(filters) {
  let placesQuery = supabase.from("places").select("*");
  let citiesQuery = supabase.from("cities").select("*");
  let countriesQuery = supabase.from("countries").select("*");

  const queryTerm = filters.search_query || "";

  // 1. Places Search
  if (queryTerm) {
    placesQuery = placesQuery.or(`name.ilike.%${queryTerm}%,country.ilike.%${queryTerm}%,region.ilike.%${queryTerm}%`);
  }
  // Apply other place-specific filters
  if (filters.category) placesQuery = placesQuery.ilike("primary_category", `%${filters.category}%`);
  if (filters.region) placesQuery = placesQuery.ilike("region", `%${filters.region}%`);
  if (filters.country) placesQuery = placesQuery.ilike("country", `%${filters.country}%`);
  if (filters.min_cost) placesQuery = placesQuery.gte("est_cost_per_day", Number(filters.min_cost));
  if (filters.max_cost) placesQuery = placesQuery.lte("est_cost_per_day", Number(filters.max_cost));

  // Execute Places Query
  const { data: places, error: placesError } = await placesQuery.limit(50);
  if (placesError) throw placesError;

  // If no search term, just return places (filtering usually applies to places)
  if (!queryTerm) {
    return places.map(p => ({ ...p, type: 'POI' }));
  }

  // 2. Cities Search (Only if search term exists)
  const { data: cities, error: citiesError } = await citiesQuery
    .or(`name.ilike.%${queryTerm}%`)
    .limit(10);
  if (citiesError) console.error("City search error", citiesError);

  // 3. Countries Search (Only if search term exists)
  const { data: countries, error: countriesError } = await countriesQuery
    .or(`name.ilike.%${queryTerm}%`)
    .limit(5);
  if (countriesError) console.error("Country search error", countriesError);

  // Combine Results
  const formattedPlaces = places.map(p => ({ ...p, id: p.place_id, type: 'POI' }));
  const formattedCities = (cities || []).map(c => ({
    ...c,
    type: 'CITY',
    country: 'City', // Placeholder if country name not joined, or fetch it
    short_desc: c.description
  }));
  const formattedCountries = (countries || []).map(c => ({
    ...c,
    type: 'COUNTRY',
    country: 'Country',
    short_desc: c.description
  }));

  return [...formattedCountries, ...formattedCities, ...formattedPlaces];
}

async function getTrendingPlaces(userCountry) {
  let query = supabase.from("places").select("*");

  // Localized ranking: if userCountry is provided, try to fetch from there first
  if (userCountry) {
    const { data: localData } = await supabase
      .from("places")
      .select("*")
      .ilike('country', userCountry)
      .limit(4);

    if (localData && localData.length > 0) {
      // Fill the rest with global trending (random/top)
      const { data: globalData } = await supabase.from("places").select("*").limit(8 - localData.length);
      return [...localData, ...(globalData || [])];
    }
  }

  // Default global trending (just first 8 for now, ideally sort by a popularity metric)
  const { data, error } = await query.limit(8);
  if (error) throw error;
  return data;
}

async function insertPlaceFromAI(place) {
  const {
    name,
    primary_category,
    tags,
    short_desc,
    visit_duration_min,
    est_cost_perday,
    country,
    region,
    latitude,
    longitude
  } = place;

  // Basic Validation
  if (!name || !country || !region || !latitude || !longitude) {
    throw new Error("Missing required fields");
  }

  //Check-1: Name + Region Duplicate Check
  const { data: nameMatches } = await supabase
    .from("places")
    .select("id")
    .ilike("name", name)
    .ilike("country", country)
    .ilike("region", region);

  if (nameMatches && nameMatches.length > 0) {
    return { status: "duplicate", reason: "name_region_match" };
  }

  //Check-2: Geo proximity Check (300m rad)
  const { data: geoMatches } = await supabase.rpc(
    "find_places_nearby",
    {
      lat: latitude,
      lon: longitude,
      radius_meters: 300
    }
  );

  if (geoMatches && geoMatches.length > 0) {
    return { status: "duplicate", reason: "geo_match" };
  }

  //Check-3: Normalize tags & category
  const cleanTags = [...new Set(tags.map(t => t.toLowerCase().trim()))];
  const cleanCategory = primary_category.toLowerCase().trim();

  //Insert
  const { data, error } = await supabase
    .from("places")
    .insert([{
      name,
      primary_category: cleanCategory,
      tags: cleanTags,
      short_desc,
      visit_duration_min,
      est_cost_perday,
      country,
      region,
      location: `POINT(${longitude} ${latitude})`,
      source: "ai",
      verified: false
    }]);

  if (error) throw error;

  return { status: "inserted", data };

}

async function getTopCities(countryId) {
  // Assuming popularity_score or population determines "top"
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_id', countryId)
    .order('popularity_score', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

async function getTopPOIs(countryId) {
  const { data, error } = await supabase
    .from('pois')
    .select('*, cities(name)')
    .eq('country_id', countryId)
    .order('popularity_score', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
}

async function getCityPOIs(cityId) {
  const { data, error } = await supabase
    .from('pois')
    .select('*')
    .eq('city_id', cityId)
    .order('popularity_score', { ascending: false }); // Return all? Or limit?
  if (error) throw error;
  return data;
}

module.exports = {
  searchPlacesDynamic,
  insertPlaceFromAI,
  getTrendingPlaces,
  getTopCities,
  getTopPOIs,
  getCityPOIs
};
