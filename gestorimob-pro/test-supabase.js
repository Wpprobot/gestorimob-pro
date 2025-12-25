
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://umuazkklbwvoxwbyraxi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdWF6a2tsYnd2b3h3YnlyYXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDU4NDYsImV4cCI6MjA4MTEyMTg0Nn0.emBkqMb456D-yYXweqVPSLfxtwMR3_AcUD4QcDVP1hY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  try {
    const { data, error } = await supabase.from('owner_settings').select('*').limit(1);
    
    if (error) {
      console.log('❌ Error connecting to Supabase:');
      console.log(error);
    } else {
      console.log('✅ Connection successful!');
      console.log('Data sample:', data);
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }
}

testConnection();
