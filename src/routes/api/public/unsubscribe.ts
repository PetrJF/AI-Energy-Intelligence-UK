import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { removeFromTrackerList, verifyUnsubscribeToken } from "@/lib/email/brevo.server";

const Body = z.object({ token: z.string().min(10).max(1000) });

export const Route = createFileRoute("/api/public/unsubscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Body.safeParse(body);
        if (!parsed.success) return Response.json({ error: "Invalid link" }, { status: 400 });
        const email = verifyUnsubscribeToken(parsed.data.token);
        if (!email) return Response.json({ error: "Invalid link" }, { status: 400 });

        const { error } = await supabaseAdmin
          .from("leads")
          .update({ unsubscribed_at: new Date().toISOString(), consent_marketing: false })
          .eq("email", email)
          .is("unsubscribed_at", null);
        if (error) {
          console.error("[unsubscribe] update failed", error.message);
          return Response.json({ error: "Failed" }, { status: 500 });
        }
        await removeFromTrackerList(email);
        return Response.json({ ok: true });
      },
    },
  },
});
