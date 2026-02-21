const supabase = require("../config/supabaseClient");

/**
 * ITINERARY TABLE SCHEMA (PostgreSQL via Supabase)
 * 
 * Columns:
 * - id (uuid, primary key)
 * - user_id (string, foreign key to User)
 * - trip_name (string)
 * - selected_places (json array)
 * - selected_itinerary (json object with title, schedule, cost)
 * - status (enum: 'draft', 'confirmed')
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

/**
 * CREATE TABLE itineraries (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id VARCHAR NOT NULL,
 *   trip_name VARCHAR NOT NULL,
 *   selected_places JSONB,
 *   selected_itinerary JSONB,
 *   status VARCHAR DEFAULT 'draft',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */

class ItineraryModel {
  /**
   * Save new itinerary to database
   * @param {string} userId - User ID from JWT
   * @param {object} itineraryData - { tripName, selectedPlaces, selectedItinerary, status }
   * @returns {object} saved itinerary with ID
   */
  static async createItinerary(userId, itineraryData) {
    const { tripName, selectedPlaces, selectedItinerary, status = "draft" } = itineraryData;

    const { data, error } = await supabase
      .from("itineraries")
      .insert({
        user_id: userId,
        trip_name: tripName,
        selected_places: selectedPlaces || [],
        selected_itinerary: selectedItinerary || null,
        status: status,
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(`Failed to save itinerary: ${error.message}`);
    }

    return data[0];
  }

  /**
   * Get itinerary by ID
   */
  static async getItineraryById(itineraryId) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", itineraryId)
      .single();

    if (error) {
      console.error("Supabase fetch error:", error);
      throw new Error(`Failed to fetch itinerary: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all itineraries for a user
   */
  static async getUserItineraries(userId) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw new Error(`Failed to fetch user itineraries: ${error.message}`);
    }

    return data;
  }

  /**
   * Update itinerary (for edits & status changes)
   */
  static async updateItinerary(itineraryId, updateData) {
    const { tripName, selectedPlaces, selectedItinerary, status } = updateData;

    const payload = {};
    if (tripName !== undefined) payload.trip_name = tripName;
    if (selectedPlaces !== undefined) payload.selected_places = selectedPlaces;
    if (selectedItinerary !== undefined) payload.selected_itinerary = selectedItinerary;
    if (status !== undefined) payload.status = status;

    // Always update the updated_at timestamp
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("itineraries")
      .update(payload)
      .eq("id", itineraryId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(`Failed to update itinerary: ${error.message}`);
    }

    return data[0];
  }

  /**
   * Delete itinerary
   */
  static async deleteItinerary(itineraryId) {
    const { error } = await supabase
      .from("itineraries")
      .delete()
      .eq("id", itineraryId);

    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(`Failed to delete itinerary: ${error.message}`);
    }

    return { success: true };
  }
}

module.exports = ItineraryModel;
