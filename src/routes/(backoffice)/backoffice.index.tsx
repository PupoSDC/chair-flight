import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(backoffice)/backoffice/")({
  beforeLoad: () => {
    throw redirect({ to: "/backoffice/comments", replace: true });
  },
});
