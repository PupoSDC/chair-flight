import { getSupabaseBrowser } from "./supabase-browser";

export const getAccessToken = async () => {
  if (typeof window === "undefined") return null;
  try {
    const { data } = await getSupabaseBrowser().getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
};
