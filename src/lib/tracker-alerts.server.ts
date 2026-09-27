// Server-only: emails project/region alert subscribers about published
// tracker records updated since their last alert.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { DC_PROJECT_PUBLIC_COLUMNS } from "@/lib/dc-public-columns";
import { SITE_URL, escapeHtml, sendBrevoEmail, unsubscribeFooter } from "@/lib/email/brevo.server";

type Lead = {
  id: string;
  email: string;
  source: string;
  inputs: Record<string, unknown> | null;
  created_at: string;
  last_alerted_at: string | null;
};

type Project = { slug: string; name: string; region: string | null; status: string | null; updated_at: string };

export async function runTrackerAlerts(): Promise<{ checked: number; sent: number; failed: number }> {
  const { data: leads, error } = await supabaseAdmin
    .from("leads")
    .select("id, email, source, inputs, created_at, last_alerted_at")
    .in("source", ["project-alert", "region-alert"])
    .is("unsubscribed_at", null);
  if (error) throw new Error(`Failed to load alert leads: ${error.message}`);

  let sent = 0;
  let failed = 0;
  for (const lead of (leads ?? []) as Lead[]) {
    const since = lead.last_alerted_at ?? lead.created_at;
    let q = supabaseAdmin
      .from("dc_projects")
      .select(DC_PROJECT_PUBLIC_COLUMNS)
      .eq("status_publication", "published")
      .gt("updated_at", since)
      .order("updated_at", { ascending: false });
    let label: string;
    if (lead.source === "project-alert") {
      const slug = typeof lead.inputs?.project_slug === "string" ? lead.inputs.project_slug : null;
      if (!slug) continue;
      q = q.eq("slug", slug);
      label = String(lead.inputs?.project_name ?? slug);
    } else {
      const region = typeof lead.inputs?.region === "string" ? lead.inputs.region : null;
      if (!region) continue;
      q = q.eq("region", region);
      label = region;
    }
    const { data: rows, error: pErr } = await q;
    if (pErr) {
      console.error("[tracker-alerts] project query failed", pErr.message);
      failed++;
      continue;
    }
    const projects = (rows ?? []) as unknown as Project[];
    if (!projects.length) continue;

    const items = projects
      .map(
        (p) => `<li style="margin-bottom:8px">
          <a href="${SITE_URL}/uk-data-centre-tracker/${encodeURIComponent(p.slug)}"><strong>${escapeHtml(p.name)}</strong></a>
          <span style="color:#666">${escapeHtml([p.region, p.status].filter(Boolean).join(" · "))}</span><br/>
          <span style="font-size:12px;color:#666">Updated ${escapeHtml(p.updated_at.slice(0, 10))}</span>
        </li>`,
      )
      .join("");

    const ok = await sendBrevoEmail({
      tag: "tracker-alerts",
      senderName: "AI Energy Intelligence UK",
      to: lead.email,
      subject: `Tracker update: ${label}`,
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
        <h1 style="font-size:18px;margin:0 0 12px">UK data-centre tracker — ${escapeHtml(label)}</h1>
        <p>${projects.length === 1 ? "This published record has" : `These ${projects.length} published records have`} been updated since we last wrote:</p>
        <ul style="padding-left:18px">${items}</ul>
        ${unsubscribeFooter(lead.email)}
      </div>`,
    });
    if (!ok) {
      failed++;
      continue;
    }
    await supabaseAdmin.from("leads").update({ last_alerted_at: new Date().toISOString() }).eq("id", lead.id);
    sent++;
  }
  return { checked: (leads ?? []).length, sent, failed };
}
