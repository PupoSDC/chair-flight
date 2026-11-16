import type { UserProfile } from "../../../libs/core/community/user";

export const requireUser = (user: UserProfile | null) => {
  if (!user) throw new Error("Sign in to continue.");
  return user;
};
