import { createFileRoute, redirect } from "@tanstack/react-router";

// The former /research placeholder has been merged into the
// Analysis & Research hub at /blog. Keep the URL alive as a redirect so
// existing links and indexed pages resolve to the real content.
export const Route = createFileRoute("/research/")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", search: {}, replace: true });
  },
});
