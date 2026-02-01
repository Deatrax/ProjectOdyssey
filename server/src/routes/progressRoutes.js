// server/src/routes/progressRoutes.js
// Group 3: Progress & Notifications Routes

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const progressCalculator = require('../services/progressCalculator');

/**
 * GET /api/progress/:itineraryId
 * Get current progress for an itinerary
 * Returns: completion percentage, time stats, distance, visit breakdown
 */
router.get('/:itineraryId', async (req, res) => {
  try {
    const { itineraryId } = req.params;
    
    if (!itineraryId) {
      return res.status(400).json({ error: 'Itinerary ID required' });
    }
    
    // Use database function for efficient calculation
    const { data, error } = await supabase
      .rpc('calculate_trip_progress', { p_itinerary_id: itineraryId });
    
    if (error) {
      console.error('Progress calculation error:', error);
      throw error;
    }
    
    // data is an array with one row
    const progress = data && data.length > 0 ? data[0] : null;
    
    if (!progress) {
      return res.status(404).json({ 
        error: 'No progress data found for this itinerary' 
      });
    }
    
    // Format time spent as human-readable
    const formattedProgress = {
      ...progress,
      time_spent_formatted: progressCalculator.formatDuration(progress.total_time_spent),
      distance_formatted: progressCalculator.formatDistance(progress.total_distance)
    };
    
    res.json({
      success: true,
      progress: formattedProgress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch progress data' 
    });
  }
});

/**
 * GET /api/progress/summary/:itineraryId
 * Get complete trip summary (for trip completion)
 * Returns: itinerary info, progress stats, all visit details
 */
router.get('/summary/:itineraryId', async (req, res) => {
  try {
    const { itineraryId } = req.params;
    
    if (!itineraryId) {
      return res.status(400).json({ error: 'Itinerary ID required' });
    }
    
    // Use database function to get comprehensive summary
    const { data, error } = await supabase
      .rpc('get_trip_summary', { p_itinerary_id: itineraryId });
    
    if (error) {
      console.error('Trip summary error:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ 
        error: 'Trip summary not found' 
      });
    }
    
    // Enrich summary with formatted values
    const enrichedSummary = progressCalculator.enrichSummary(data);
    
    res.json({
      success: true,
      summary: enrichedSummary
    });
  } catch (error) {
    console.error('Get trip summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trip summary' 
    });
  }
});

/**
 * GET /api/progress/stats/:itineraryId
 * Get lightweight stats (for real-time updates)
 * Returns: just the key numbers without heavy computation
 */
router.get('/stats/:itineraryId', async (req, res) => {
  try {
    const { itineraryId } = req.params;
    
    // Quick query for visit counts
    const { data: visits, error } = await supabase
      .from('visit_logs')
      .select('status, time_spent')
      .eq('itinerary_id', itineraryId);
    
    if (error) throw error;
    
    const stats = {
      total: visits.length,
      completed: visits.filter(v => v.status === 'completed').length,
      in_progress: visits.filter(v => v.status === 'in_progress').length,
      pending: visits.filter(v => v.status === 'pending').length,
      skipped: visits.filter(v => v.status === 'skipped').length
    };
    
    stats.completion_percentage = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0;
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats' 
    });
  }
});

/**
 * POST /api/progress/notify
 * Trigger a notification (called after check-in/check-out)
 * Body: { itineraryId, userId, type, message, metadata }
 */
router.post('/notify', async (req, res) => {
  try {
    const { itineraryId, userId, type, message, metadata } = req.body;
    
    if (!itineraryId || !userId || !type || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: itineraryId, userId, type, message' 
      });
    }
    
    // Check user's notification preferences
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Preferences fetch error:', prefsError);
    }
    
    // Default to enabled if no preferences set
    const preferences = prefs || {
      arrival_enabled: true,
      departure_enabled: true,
      progress_enabled: true,
      browser_notifications_enabled: false
    };
    
    // Check if this notification type is enabled
    const typeKey = `${type}_enabled`;
    if (preferences[typeKey] === false) {
      return res.json({
        success: true,
        sent: false,
        reason: 'Notification type disabled by user'
      });
    }
    
    // Log notification
    const { data: log, error: logError } = await supabase
      .from('notification_logs')
      .insert({
        user_id: userId,
        itinerary_id: itineraryId,
        type: type,
        message: message,
        metadata: metadata || {}
      })
      .select()
      .single();
    
    if (logError) {
      console.error('Notification log error:', logError);
      throw logError;
    }
    
    res.json({
      success: true,
      sent: true,
      notification: log,
      // Frontend will display the notification using browser Notification API
      displayData: {
        title: message,
        body: metadata?.body || '',
        icon: metadata?.icon || '/logo.png',
        data: metadata
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ 
      error: 'Failed to send notification' 
    });
  }
});

/**
 * GET /api/progress/notifications/preferences/:userId
 * Get user's notification preferences
 */
router.get('/notifications/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No preferences yet, create default
      const { data: newPrefs, error: insertError } = await supabase
        .rpc('create_default_notification_preferences', { p_user_id: userId });
      
      if (insertError) throw insertError;
      
      // Fetch the newly created preferences
      const { data: created, error: fetchError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      
      return res.json({
        success: true,
        preferences: created
      });
    }
    
    if (error) throw error;
    
    res.json({
      success: true,
      preferences: data
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notification preferences' 
    });
  }
});

/**
 * PUT /api/progress/notifications/preferences/:userId
 * Update user's notification preferences
 * Body: { arrival_enabled, departure_enabled, etc. }
 */
router.put('/notifications/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Ensure user_id is set
    updates.user_id = userId;
    
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert(updates, { onConflict: 'user_id' })
      .select()
      .single();
    
    if (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
    
    res.json({
      success: true,
      preferences: data
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ 
      error: 'Failed to update notification preferences' 
    });
  }
});

/**
 * GET /api/progress/notifications/history/:userId
 * Get notification history for a user
 * Query params: ?limit=20&itineraryId=xxx
 */
router.get('/notifications/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, itineraryId } = req.query;
    
    let query = supabase
      .from('notification_logs')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(parseInt(limit));
    
    if (itineraryId) {
      query = query.eq('itinerary_id', itineraryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      notifications: data,
      count: data.length
    });
  } catch (error) {
    console.error('Get notification history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notification history' 
    });
  }
});

module.exports = router;
