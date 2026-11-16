import type { UserProfile } from "../../../libs/core/community/user";

export const requireAdmin = (user: UserProfile | null) => {
  if (user?.role !== "admin") throw new Error("Not allowed.");
  return user;
};
