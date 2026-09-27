import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (s) => z.object({ token: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Unsubscribe — AI Energy Intelligence UK" },
      { name: "description", content: "Stop tracker alerts and update emails from AI Energy Intelligence UK." },
      { property: "og:title", content: "Unsubscribe — AI Energy Intelligence UK" },
      { property: "og:description", content: "Stop tracker alerts and update emails." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const [state, setState] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    if (!token) {
      setState("error");
      return;
    }
    fetch("/api/public/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => setState(r.ok ? "done" : "error"))
      .catch(() => setState("error"));
  }, [token]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">
        {state === "working" ? "Unsubscribing…" : state === "done" ? "You're unsubscribed" : "This link isn't valid"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {state === "done"
          ? "You won't receive any more tracker alerts or update emails from us."
          : state === "error"
            ? "The unsubscribe link may be incomplete. Please email info@aienergyintelligence.co.uk and we'll remove you."
            : "One moment."}
      </p>
      <Link to="/" className="mt-6 inline-block underline">
        Back to the homepage
      </Link>
    </div>
  );
}
