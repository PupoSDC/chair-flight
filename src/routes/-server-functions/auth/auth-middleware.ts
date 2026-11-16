import { createMiddleware } from "@tanstack/react-start";
import { getCookie, getRequestHeader } from "@tanstack/react-start/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { profiles } from "../../../database";
import { isUserFlowEnabled } from "../../../libs/base/feature-flags";
import { getRandomId } from "../../../libs/base/get-random-id";
import { isLocalDatabase } from "../../../libs/base/is-local-database";
import { DEV_USER_COOKIE } from "../../../libs/core/community/dev-user";
import { getUsernameCandidate } from "../../../libs/core/community/get-username-candidate";
import { getAccessToken } from "../../../libs/providers/get-access-token";
import { getSupabaseAuth } from "../../../libs/providers/supabase-auth";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import type { UserProfile } from "../../../libs/core/community/user";

const MAX_USERNAME_ATTEMPTS = 5;

const readProfile = async (userId: string) => {
  const [profile] = await getSupabaseDb()
    .select({
      id: profiles.id,
      username: profiles.username,
      role: profiles.role,
    })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return profile ?? null;
};

const createProfile = async (userId: string, name: string) => {
  const db = getSupabaseDb();
  const candidate = getUsernameCandidate(name);
  for (let attempt = 0; attempt < MAX_USERNAME_ATTEMPTS; attempt++) {
    const username =
      attempt === 0
        ? candidate
        : `${candidate}_${getRandomId().slice(0, 3).toLowerCase()}`;
    const [taken] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(sql`lower(${profiles.username})`, username.toLowerCase()));
    if (taken) continue;
    await db
      .insert(profiles)
      .values({ id: userId, username })
      .onConflictDoNothing();
    const profile = await readProfile(userId);
    if (profile) return profile;
  }
  return null;
};

const readDevUser = async () => {
  if (!import.meta.env.DEV || !isLocalDatabase(process.env.DATABASE_URL)) {
    return null;
  }
  const userId = z.uuid().safeParse(getCookie(DEV_USER_COOKIE));
  return userId.success ? readProfile(userId.data) : null;
};

const readSessionUser = async (): Promise<UserProfile | null> => {
  const devUser = await readDevUser();
  if (devUser) return devUser;
  const token = getRequestHeader("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;
  const { data, error } = await getSupabaseAuth().getClaims(token);
  if (error || !data?.claims.sub) return null;
  const { sub, email, user_metadata: metadata } = data.claims;
  const name =
    metadata?.username ??
    metadata?.full_name ??
    metadata?.name ??
    email?.split("@")[0] ??
    "";
  return (await readProfile(sub)) ?? (await createProfile(sub, String(name)));
};

export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const token = await getAccessToken();
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  })
  .server(async ({ next }) => {
    if (!isUserFlowEnabled) throw new Error("Not found.");
    return next({ context: { user: await readSessionUser() } });
  });
