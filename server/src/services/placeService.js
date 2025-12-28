const supabase = require("../config/supabaseClient");

/// -- ->Note for other developers working with AI -- //
async function searchPlacesDynamic(filters) {
  let query = supabase.from("places").select("*");

  const orConditions = [];

  // ->Optional not mendatory to match but if matches it will provide the matching category from the db
  if (filters.category) {
    orConditions.push(`primary_category.ilike.%${filters.category}%`);
  }

  // ->(Optional) If matches good if not matches will check for other options
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    filters.tags.forEach((tag) => {
      orConditions.push(`tags.cs.{${tag}}`);
    });
  }

  if (orConditions.length > 0) {
    query = query.or(orConditions.join(","));
  }

  // ->Region match (must match if provided)
  if (filters.region) {
    query = query.ilike("region", `%${filters.region}%`);
  }

  // ->Country match (must match if provided)
  if (filters.country) {
    query = query.ilike("country", `%${filters.country}%`);
  }

  // ->(must match if provided)
  if (filters.min_cost) {
    query = query.gte("est_cost_per_day", Number(filters.min_cost));
  }
  // ->(must match if provided)
  if (filters.max_cost) {
    query = query.lte("est_cost_per_day", Number(filters.max_cost));
  }

  const { data, error } = await query;

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

module.exports = { searchPlacesDynamic, insertPlaceFromAI };
