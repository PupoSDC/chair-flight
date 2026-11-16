import { useSyncExternalStore } from "react";
import { fetchProfile } from "../../../routes/-server-functions/auth/fetch-profile";
import { DEV_USER_COOKIE } from "../../core/community/dev-user";
import { getSupabaseBrowser } from "../../providers/supabase-browser";
import type { OAuthProvider, UserProfile } from "../../core/community/user";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "guest"; user: null }
  | { status: "user"; user: UserProfile };

const LOADING: AuthState = { status: "loading", user: null };
const GUEST: AuthState = { status: "guest", user: null };
const LISTENERS = new Set<() => void>();

let state: AuthState = LOADING;
let started = false;

const setState = (nextState: AuthState) => {
  state = nextState;
  for (const listener of LISTENERS) listener();
};

const refresh = async (hasSession: boolean) => {
  if (!hasSession && !import.meta.env.DEV) return setState(GUEST);
  try {
    const user = await fetchProfile();
    setState(user ? { status: "user", user } : GUEST);
  } catch {
    setState(GUEST);
  }
};

const start = () => {
  if (started) return;
  started = true;
  if (import.meta.env.DEV) refresh(false);
  try {
    getSupabaseBrowser().onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      setTimeout(() => refresh(Boolean(session)), 0);
    });
  } catch {
    if (!import.meta.env.DEV) setState(GUEST);
  }
};

const subscribe = (listener: () => void) => {
  LISTENERS.add(listener);
  start();
  return () => {
    LISTENERS.delete(listener);
  };
};

const signInWith = async (provider: OAuthProvider) => {
  const { error } = await getSupabaseBrowser().signInWithOAuth({
    provider,
    options: { redirectTo: window.location.href },
  });
  if (error) throw new Error(error.message);
};

const signOut = async () => {
  if (import.meta.env.DEV) {
    // biome-ignore lint/suspicious/noDocumentCookie: dev-only, cookieStore is not available everywhere
    document.cookie = `${DEV_USER_COOKIE}=; Path=/; Max-Age=0`;
  }
  try {
    await getSupabaseBrowser().signOut();
  } catch {}
  setState(GUEST);
};

export const useAuth = () => {
  const auth = useSyncExternalStore(
    subscribe,
    () => state,
    () => LOADING,
  );
  return { ...auth, signInWith, signOut };
};
