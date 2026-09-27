/**
 * Automated link validation for the Tier 1 AI energy calculators.
 *
 * Verifies, for every calculator's RelatedContent block, that:
 *  1. each link points at the correct destination host for its label
 *     (AI Energy Intelligence UK / PowerGuardian / Energy Sector — Cyber Security / Official Source), and
 *  2. each URL is reachable over the network (2xx/3xx).
 *
 * Run with:  bun run scripts/validate-related-links.ts
 * Exits non-zero if any check fails, so it can gate CI.
 */
import { RELATED, RELATED_KEYS, EXPECTED_HOSTS } from "../src/components/energy/relatedLinks";

const TIMEOUT_MS = 15000;
const UA =
  "Mozilla/5.0 (compatible; AIEI-LinkValidator/1.0; +https://aienergyintelligence.co.uk)";

type Failure = { calculator: string; label: string; href: string; reason: string };

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

async function isReachable(url: string): Promise<{ ok: boolean; reason: string }> {
  const tryOnce = async (method: "HEAD" | "GET") => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": UA, Accept: "*/*" },
      });
      return res.status;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    // Some servers reject HEAD; fall back to GET when needed.
    let status = await tryOnce("HEAD").catch(() => 0);
    if (status === 0 || status === 405 || status === 403 || status >= 500) {
      status = await tryOnce("GET");
    }
    if (status >= 200 && status < 400) return { ok: true, reason: `HTTP ${status}` };
    return { ok: false, reason: `HTTP ${status}` };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  const failures: Failure[] = [];
  let checks = 0;

  for (const key of RELATED_KEYS) {
    const rows = RELATED[key];
    if (!rows || rows.length === 0) {
      failures.push({ calculator: key, label: "-", href: "-", reason: "no links defined" });
      continue;
    }

    for (const row of rows) {
      // Internal links point at our own TanStack routes (e.g. /blog/...); no host to validate.
      if (row.internal) continue;
      checks++;
      const host = hostOf(row.href);


      // 1) Correct destination for the label.
      const expected = EXPECTED_HOSTS[row.label];
      if (!expected) {
        failures.push({ calculator: key, label: row.label, href: row.href, reason: "unknown label" });
      } else if (!host || !expected.includes(host)) {
        failures.push({
          calculator: key,
          label: row.label,
          href: row.href,
          reason: `host '${host}' not in expected [${expected.join(", ")}]`,
        });
        continue; // skip reachability if destination is already wrong
      }

      // 2) Reachability.
      const { ok, reason } = await isReachable(row.href);
      const tick = ok ? "✓" : "✗";
      console.log(`${tick} [${key}] ${row.label.padEnd(15)} ${reason.padEnd(10)} ${row.href}`);
      if (!ok) failures.push({ calculator: key, label: row.label, href: row.href, reason });
    }
  }

  console.log(`\nChecked ${checks} links across ${RELATED_KEYS.length} calculators.`);

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} link check(s) failed:`);
    for (const f of failures) {
      console.error(`   [${f.calculator}] ${f.label}: ${f.reason} — ${f.href}`);
    }
    process.exit(1);
  }

  console.log("✅ All RelatedContent links are correctly mapped and reachable.");
}

main().catch((err) => {
  console.error("Validator crashed:", err);
  process.exit(1);
});
