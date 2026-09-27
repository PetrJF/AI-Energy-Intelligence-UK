import { createFileRoute } from "@tanstack/react-router";
import { issueChallenge } from "@/lib/captcha.server";

export const Route = createFileRoute("/api/public/captcha")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(issueChallenge(), {
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
