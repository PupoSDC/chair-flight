import { createClient } from "@supabase/supabase-js";

let instance: ReturnType<typeof createClient> | null = null;

export const getSupabaseBrowser = () => {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY. See .env.example.",
    );
  }
  instance ??= createClient(url, key);
  return instance.auth;
};
