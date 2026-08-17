import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaces a clear warning in the console during local dev / build
  // instead of a cryptic fetch failure inside the booking flow.
  console.warn(
    "Supabase env vars are missing. Copy .env.local.example to .env.local and fill in your project URL + anon key."
  );
}

// createClient throws on an empty string, which would crash the
// production build during static prerendering before env vars are
// configured. Falling back to a syntactically valid placeholder keeps
// the build green; real requests will still fail loudly at runtime
// until .env.local is filled in, which is the correct behavior.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
