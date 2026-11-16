export type UserRole = "user" | "admin";

export type UserProfile = {
  id: string;
  username: string;
  role: UserRole;
};

export const OAUTH_PROVIDERS = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
  { id: "facebook", label: "Facebook" },
  { id: "apple", label: "Apple" },
] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]["id"];
