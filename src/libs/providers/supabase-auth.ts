import { createClient } from "@supabase/supabase-js";
import { readEnv } from "../base/read-env";

let instance: ReturnType<typeof createClient> | null = null;

export const getSupabaseAuth = () => {
  instance ??= createClient(
    readEnv("SUPABASE_URL"),
    readEnv("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return instance.auth;
};
