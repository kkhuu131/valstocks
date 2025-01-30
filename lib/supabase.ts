// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase URL and API key
const SUPABASE_URL="https://ohpzvwguqtpruqfdmlst.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocHp2d2d1cXRwcnVxZmRtbHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ5NzA3NDksImV4cCI6MjAzMDU0Njc0OX0.RuCB9z5-953W6Fb_83bx87GdPu93A76jjl3N3Au9J9o";

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);