import { createClient } from "@supabase/supabase-js";

const url = "https://wfprjxhdftoiyrnvhzuv.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmcHJqeGhkZnRvaXlybnZoenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyODA5MTksImV4cCI6MjEwMTg1NjkxOX0.idkeOSSHHsv3HBUrhOF2gi_8a5_j-hDVW1f2fZ2L_5A";

export const externalSupabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});