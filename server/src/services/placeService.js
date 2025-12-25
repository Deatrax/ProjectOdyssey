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
    filters.tags.forEach(tag => {
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

module.exports = { searchPlacesDynamic };
