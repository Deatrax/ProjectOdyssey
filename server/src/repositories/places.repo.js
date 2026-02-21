// MOCK DB SEARCH — will be replaced by Postgres later

async function searchPlaces(query, filters = {}) {
  //simulate "DB-first" behavior
  if (query.toLowerCase().includes("sea")) {
    return [
      {
        placeId: "db_001",
        name: "Cox's Bazar",
        category: "nature",
        shortDesc: "World’s longest sandy sea beach.",
        estCostPerDay: 3500,
      },
      {
        placeId: "db_002",
        name: "Kuakata",
        category: "nature",
        shortDesc: "Beach famous for sunrise and sunset.",
        estCostPerDay: 3000,
      },
    ];
  }

  return []; // simulate “DB has no good match”
}

module.exports = { searchPlaces };
