// Server-side Supabase client using the publishable (anon) key.
// Used for public, RLS-protected reads so that public pages do not depend on
// the service-role JWT (which can fail with PGRST303 when clocks drift).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let _client: ReturnType<typeof createPublicClient> | undefined;

function createPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
  }
  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getPublicSupabase() {
  if (!_client) _client = createPublicClient();
  return _client;
}
