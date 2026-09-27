import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Returns only the fields needed to regenerate a PDF report — never the
// email or other PII. Public id is uuid; if you have it, you get the report.
export const getReportById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("leads")
      .select("id, source, variant, inputs, result_summary, created_at")
      .eq("id", data.id)
      .maybeSingle();

    if (error) {
      console.error("[report] fetch failed", error);
      return { report: null as null };
    }
    if (!row) return { report: null as null };

    return {
      report: {
        id: row.id,
        source: row.source,
        variant: row.variant,
        inputs: JSON.stringify(row.inputs ?? {}),
        resultSummary: JSON.stringify(row.result_summary ?? {}),
        createdAt: row.created_at,
      },
    };
  });
