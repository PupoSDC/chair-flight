import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(modules)/modules/type/$")({
  beforeLoad: () => {
    throw redirect({ to: "/modules" });
  },
});
