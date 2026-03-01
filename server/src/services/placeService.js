const supabase = require("../config/supabaseClient");

/// -- ->Note for other developers working with AI -- //
async function attachImagesToPlaces(placesList) {
  if (!placesList || placesList.length === 0) return placesList;

  // Group by type for efficient querying
  const placesByType = {
    'COUNTRY': [],
    'CITY': [],     // Both CITY and DISTRICT use 'CITY' in place_images
    'DISTRICT': [],
    'POI': []
  };

  placesList.forEach((p, idx) => {
    let t = p.type || 'POI';
    if (!placesByType[t]) placesByType[t] = [];
    placesByType[t].push({ id: String(p.id), index: idx });
  });

  const imagePromises = [];

  for (const [type, items] of Object.entries(placesByType)) {
    if (items.length === 0) continue;
    const ids = items.map(i => i.id);
    const dbType = type === 'DISTRICT' ? 'CITY' : type;

    imagePromises.push(
      supabase.from('place_images')
        .select('place_id, url')
        .in('place_id', ids)
        .eq('place_type', dbType)
        .order('display_order', { ascending: true })
    );
  }

  if (imagePromises.length === 0) return placesList;

  try {
    const results = await Promise.all(imagePromises);
    const imageMap = {};

    results.forEach(res => {
      if (res.data) {
        res.data.forEach(img => {
          if (!imageMap[String(img.place_id)]) {
            imageMap[String(img.place_id)] = img.url;
          }
        });
      }
    });

    return placesList.map(p => ({
      ...p,
      img_url: imageMap[String(p.id)] || null,
      images: imageMap[String(p.id)] ? [{ url: imageMap[String(p.id)] }] : []
    }));
  } catch (error) {
    console.error("Error attaching images to places:", error);
    return placesList;
  }
}

async function searchPlacesDynamic(filters) {
  const queryTerm = (filters.search_query || "").trim();

  // ── No search term: return plain POI list with any extra filters ─────────
  if (!queryTerm) {
    let q = supabase.from("places").select("*");
    if (filters.category) q = q.ilike("primary_category", `%${filters.category}%`);
    if (filters.region) q = q.ilike("region", `%${filters.region}%`);
    if (filters.country) q = q.ilike("country", `%${filters.country}%`);
    if (filters.min_cost) q = q.gte("est_cost_per_day", Number(filters.min_cost));
    if (filters.max_cost) q = q.lte("est_cost_per_day", Number(filters.max_cost));
    const { data, error } = await q.limit(50);
    if (error) throw error;
    return (data || []).map(p => ({ ...p, id: String(p.place_id || p.id), type: 'POI', district: p.region || p.city }));
  }

  // ════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Resolve matching countries & cities (parallel)
  // ════════════════════════════════════════════════════════════════════════
  const [
    { data: countries, error: countriesError },
    { data: citiesDirect, error: citiesError }
  ] = await Promise.all([
    supabase.from("countries").select("*").ilike("name", `%${queryTerm}%`).limit(5),
    supabase.from("cities").select("*")
      .or(`name.ilike.%${queryTerm}%,country_name.ilike.%${queryTerm}%`)
      .limit(20)
  ]);

  if (countriesError) console.error("Country search error", countriesError);

  // Graceful fallback if country_name column doesn't exist in schema
  let resolvedCities = [];
  if (citiesError) {
    const { data: fallback } = await supabase
      .from("cities").select("*").ilike("name", `%${queryTerm}%`).limit(20);
    resolvedCities = fallback || [];
  } else {
    resolvedCities = citiesDirect || [];
  }

  // Collect matched city UUIDs for the FK lookup in phase 2
  const matchedCityIds = resolvedCities.map(c => c.id).filter(Boolean);

  // ════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Fetch POIs:
  //   (A) ALL places whose city_id is in the matched cities (by FK)
  //       e.g. searching "Paris" → every POI with city_id = Paris's UUID
  //   (B) Places that directly mention the query in name/city/region/country
  // ════════════════════════════════════════════════════════════════════════
  const placePromises = [
    // (B) direct text match
    supabase.from("places").select("*")
      .or(`name.ilike.%${queryTerm}%,city.ilike.%${queryTerm}%,region.ilike.%${queryTerm}%,country.ilike.%${queryTerm}%`)
      .limit(50)
  ];

  if (matchedCityIds.length > 0) {
    // (A) all POIs belonging to matched cities
    placePromises.push(
      supabase.from("places").select("*")
        .in("city_id", matchedCityIds)
        .limit(50)
    );
  }

  const placeResults = await Promise.all(placePromises);
  const allRawPlaces = placeResults.flatMap(r => r.data || []);

  // Apply any extra filter params on top
  const filteredPlaces = allRawPlaces.filter(p => {
    if (filters.category && !p.primary_category?.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.region && !p.region?.toLowerCase().includes(filters.region.toLowerCase())) return false;
    if (filters.country && !p.country?.toLowerCase().includes(filters.country.toLowerCase())) return false;
    if (filters.min_cost && Number(p.est_cost_per_day) < Number(filters.min_cost)) return false;
    if (filters.max_cost && Number(p.est_cost_per_day) > Number(filters.max_cost)) return false;
    return true;
  });

  // ════════════════════════════════════════════════════════════════════════
  // FORMAT  — normalise into a common shape
  // ════════════════════════════════════════════════════════════════════════
  const formattedCountries = (countries || []).map(c => ({
    ...c,
    id: String(c.id),
    type: 'COUNTRY',
    country: c.name,
    short_desc: c.description || c.short_description
  }));

  const formattedCities = resolvedCities.map(c => ({
    ...c,
    id: String(c.id),
    type: 'DISTRICT',
    country: c.country_name || '',
    short_desc: c.description || c.short_description
  }));

  // ── Within POI tier: city-FK-matched places come before text-only matches ─
  // This prevents unrelated places (e.g. "Faridpur" matching "par" in "paris")
  // from appearing before the actual POIs that live inside the searched city.
  const matchedCityIdSet = new Set(matchedCityIds.map(String));

  const cityFkPlaces = []; // POIs that belong to the matched city by FK
  const textOnlyPlaces = []; // POIs that only matched by text (name/region/etc.)

  for (const p of filteredPlaces) {
    if (p.city_id && matchedCityIdSet.has(String(p.city_id))) {
      cityFkPlaces.push(p);
    } else {
      textOnlyPlaces.push(p);
    }
  }

  const formatPlace = p => ({
    ...p,
    id: String(p.place_id || p.id),
    type: 'POI',
    district: p.region || p.city
  });

  const formattedPlaces = [
    ...cityFkPlaces.map(formatPlace),   // 1st: all POIs in the searched city
    ...textOnlyPlaces.map(formatPlace)  // 2nd: text-matched POIs from anywhere
  ];

  // ════════════════════════════════════════════════════════════════════════
  // SORT & DEDUPLICATE — COUNTRY → DISTRICT → POI (city-FK first)
  // ════════════════════════════════════════════════════════════════════════
  const dedup = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  return await attachImagesToPlaces([
    ...dedup(formattedCountries),
    ...dedup(formattedCities),
    ...dedup(formattedPlaces)  // already ordered: city-FK first, then text-only
  ]);
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

  // Tag them as POI for attachImagesToPlaces
  const formattedData = (data || []).map(p => ({ ...p, id: String(p.place_id || p.id), type: 'POI' }));
  return await attachImagesToPlaces(formattedData);
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
