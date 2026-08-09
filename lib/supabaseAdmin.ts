import "server-only";
import { createClient } from "@supabase/supabase-js";

// SECURITY: this file must only ever be imported from server-side code
// (Server Components, Route Handlers, middleware never imports this).
// The `server-only` import above makes Next.js throw a build error if
// this ever gets pulled into client-side JavaScript by mistake — the
// service role key bypasses Row Level Security entirely, so it can
// read/delete every row in every table.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "Supabase admin env vars are missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings -> API -> service_role in Supabase)."
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-role-key",
  {
    auth: { persistSession: false },
  }
);
