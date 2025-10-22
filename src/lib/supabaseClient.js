// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pjxrjytcurqrmbuhgyoi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqeHJqeXRjdXJxcm1idWhneW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjYxNTcsImV4cCI6MjA3NjcwMjE1N30.H5xP2ZlKFl_-h41I_ZjCcGmt0NLK64eOwO8Ipr2sfZQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
