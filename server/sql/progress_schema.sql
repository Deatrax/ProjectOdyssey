-- SQL schema for progress tracking and notifications
-- Group 3: Progress & Notifications
-- Run these in Supabase SQL Editor

-- 1. Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id VARCHAR PRIMARY KEY,
  arrival_enabled BOOLEAN DEFAULT TRUE,
  departure_enabled BOOLEAN DEFAULT TRUE,
  progress_enabled BOOLEAN DEFAULT TRUE,
  browser_notifications_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Notification Logs Table (for analytics and history)
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL, -- 'arrival', 'departure', 'progress', 'completion'
  message TEXT NOT NULL,
  metadata JSONB, -- Additional data like place_id, place_name, etc.
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notification logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_user 
ON notification_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_notification_logs_itinerary 
ON notification_logs(itinerary_id);

CREATE INDEX IF NOT EXISTS idx_notification_logs_type 
ON notification_logs(type);

CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at 
ON notification_logs(sent_at DESC);

-- 3. Function to calculate trip progress
CREATE OR REPLACE FUNCTION calculate_trip_progress(p_itinerary_id UUID)
RETURNS TABLE (
  total_places INTEGER,
  completed_places INTEGER,
  in_progress_places INTEGER,
  pending_places INTEGER,
  skipped_places INTEGER,
  completion_percentage NUMERIC,
  total_time_spent INTEGER, -- in seconds
  total_distance NUMERIC -- in meters from map_routes
) AS $$
BEGIN
  RETURN QUERY
  WITH visit_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'skipped') as skipped,
      COUNT(*) as total,
      COALESCE(SUM(time_spent), 0) as time_spent
    FROM visit_logs
    WHERE itinerary_id = p_itinerary_id
  ),
  route_stats AS (
    SELECT
      COALESCE(
        (map_routes->'summary'->>'totalDistance')::NUMERIC,
        0
      ) as distance
    FROM itineraries
    WHERE id = p_itinerary_id
  )
  SELECT
    vs.total::INTEGER,
    vs.completed::INTEGER,
    vs.in_progress::INTEGER,
    vs.pending::INTEGER,
    vs.skipped::INTEGER,
    CASE 
      WHEN vs.total > 0 THEN ROUND((vs.completed::NUMERIC / vs.total::NUMERIC) * 100, 2)
      ELSE 0
    END as completion_percentage,
    vs.time_spent::INTEGER,
    COALESCE(rs.distance, 0) as total_distance
  FROM visit_stats vs
  CROSS JOIN route_stats rs;
END;
$$ LANGUAGE plpgsql;

-- 4. Function to get trip summary (for completion)
CREATE OR REPLACE FUNCTION get_trip_summary(p_itinerary_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_summary JSONB;
BEGIN
  WITH progress_data AS (
    SELECT * FROM calculate_trip_progress(p_itinerary_id)
  ),
  itinerary_data AS (
    SELECT
      name,
      destination,
      created_at,
      map_routes
    FROM itineraries
    WHERE id = p_itinerary_id
  ),
  visit_data AS (
    SELECT
      place_name,
      time_spent,
      user_rating,
      entered_at,
      exited_at
    FROM visit_logs
    WHERE itinerary_id = p_itinerary_id
    AND status = 'completed'
    ORDER BY entered_at
  )
  SELECT jsonb_build_object(
    'itinerary', (SELECT row_to_json(i.*) FROM itinerary_data i),
    'progress', (SELECT row_to_json(p.*) FROM progress_data p),
    'visits', (SELECT jsonb_agg(row_to_json(v.*)) FROM visit_data v)
  ) INTO v_summary;
  
  RETURN v_summary;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger to update notification preferences timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notification_preferences_timestamp
BEFORE UPDATE ON notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_notification_preferences_timestamp();

-- 6. Default notification preferences for new users
-- This can be called when a user signs up or makes their first itinerary
CREATE OR REPLACE FUNCTION create_default_notification_preferences(p_user_id VARCHAR)
RETURNS void AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
