const supabase = require("../config/supabaseClient");

async function searchPlacesDynamic(filters) {
  let query = supabase.from("places").select("*");

  // Filter by name
  if (filters.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }

  // Filter by primary category
  if (filters.category) {
    query = query.eq("primary_category", filters.category);
  }

  // Filter by tags (comma separated)
  if (filters.tags && Array.isArray(filters.tags)) {
    query = query.overlaps("tags", filters.tags);
  }

  // Filter by region (case-insensitive, substring match)
  if (filters.region) {
    query = query.ilike("region", `%${filters.region}%`);
  }

  // Filter by country (case-insensitive, substring match)
  if (filters.country) {
    query = query.ilike("country", `%${filters.country}%`);
  }

  // Filter by max cost
  if (filters.max_cost) {
    query = query.lte("est_cost_per_day", Number(filters.max_cost));
  }

  // Filter by min cost
  if (filters.min_cost) {
    query = query.gte("est_cost_per_day", Number(filters.min_cost));
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}

module.exports = {
  searchPlacesDynamic,
};
