function detectIntent(message) {
  const m = message.toLowerCase();

  if (m.includes("itinerary") || m.includes("plan") || m.includes("days")) {
    return "generate_itinerary";
  }

  return "search_places";
}

module.exports = { detectIntent };
