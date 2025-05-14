/**
 * @file supabase.ts
 * @description Initializes and exports the Supabase client for use throughout the CardioTrack app.
 * @module supabase
 */

import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Make sure to set environment variables.');
}

/**
 * Supabase client instance used for querying the heart_rate_data table.
 */

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
