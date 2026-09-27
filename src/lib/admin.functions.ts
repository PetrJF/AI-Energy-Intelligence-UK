import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden");
}

export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) return { isAdmin: false };
    return { isAdmin: !!data };
  });

export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabase } = context;

    const [leadsRes, reportsRes] = await Promise.all([
      supabase
        .from("leads")
        .select(
          "id, email, source, variant, inputs, result_summary, consent_marketing, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(2000),
      supabase
        .from("saved_reports")
        .select("id, user_id, title, category, source, download_url, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (leadsRes.error) throw new Error(leadsRes.error.message);
    if (reportsRes.error) throw new Error(reportsRes.error.message);

    const leads = leadsRes.data ?? [];
    const reports = reportsRes.data ?? [];

    // Category mapping. Report downloads are their own category — they were
    // previously counted as tool submissions, which overstated tool usage.
    const NEWSLETTER = new Set(["homepage-newsletter", "footer-newsletter"]);
    const CONSULTANCY = new Set(["consultancy-enquiry", "contact-enquiry", "services-enquiry"]);
    const DOWNLOADS = new Set(["report-download"]);

    const downloads = leads.filter((l: any) => DOWNLOADS.has(l.source));
    const newsletter = leads.filter((l: any) => NEWSLETTER.has(l.source));
    const consultancy = leads.filter((l: any) => CONSULTANCY.has(l.source));
    const toolLeads = leads.filter(
      (l: any) =>
        !NEWSLETTER.has(l.source) && !CONSULTANCY.has(l.source) && !DOWNLOADS.has(l.source),
    );

    // Repeat downloads are kept, not removed — they are shown separately so
    // they cannot inflate the count of people who requested a report.
    const downloadEmails = new Set(downloads.map((l: any) => String(l.email).toLowerCase()));
    const distinctDownloaders = downloadEmails.size;
    const repeatDownloads = downloads.length - distinctDownloaders;

    // Unsolicited sales/SEO pitches are flagged so genuine commercial interest
    // is not overstated. Records are never modified or deleted.
    const SOLICITATION = /\b(seo|backlink|guest post|web ?design|our agency|digital marketing|rank(ing)? your|outreach|link building|we can help you (rank|grow)|increase your traffic)\b/i;
    const enquiryText = (l: any) =>
      [l.inputs, l.result_summary].map((v) => (v ? JSON.stringify(v) : "")).join(" ");
    const isSolicitation = (l: any) => SOLICITATION.test(enquiryText(l));

    const consultancySolicitation = consultancy.filter(isSolicitation);
    const consultancyGenuine = consultancy.filter((l: any) => !isSolicitation(l));

    // Simple analytics: counts by day (30d) and by source
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const bySourceMap = new Map<string, number>();
    const byDayMap = new Map<string, number>();
    for (const l of leads) {
      bySourceMap.set(l.source, (bySourceMap.get(l.source) ?? 0) + 1);
      const t = new Date(l.created_at).getTime();
      if (t >= thirtyDaysAgo) {
        const day = new Date(l.created_at).toISOString().slice(0, 10);
        byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1);
      }
    }
    const bySource = Array.from(bySourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
    const byDay = Array.from(byDayMap.entries())
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));

    return {
      toolLeads,
      downloads,
      newsletter,
      consultancy,
      reports,
      analytics: {
        totalLeads: leads.length,
        // `reports` are saved-report records in signed-in dashboards, which is
        // a different thing from a report download submission.
        totalReports: reports.length,
        newsletterCount: newsletter.length,
        consultancyCount: consultancy.length,
        consultancyGenuineCount: consultancyGenuine.length,
        consultancySolicitationCount: consultancySolicitation.length,
        toolLeadsCount: toolLeads.length,
        downloadsCount: downloads.length,
        distinctDownloaders,
        repeatDownloads,
        bySource,
        byDay,
      },
    };
  });
