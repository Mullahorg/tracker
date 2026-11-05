import { createFileRoute, redirect } from "@tanstack/react-router";

// Old or unknown links (e.g. removed /reports and /missions pages) go back to sign-in.
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
