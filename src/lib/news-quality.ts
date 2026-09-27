/**
 * Public display quality rules for automated news items.
 *
 * Items whose source content could not be retrieved (paywalls, access denied,
 * empty extractions) must not be presented as ordinary news stories. This is a
 * display/publishing filter only — no database records are deleted.
 *
 * The display filter and the ingestion guard share one detector so that a
 * story about paywalls (legitimate coverage) is never hidden, while a stub
 * saying the source could not be read is always held back.
 */

type NewsLike = {
  title?: string | null;
  headline?: string | null;
  analysis?: string | null;
  [key: string]: unknown;
};

function haystack(item: NewsLike) {
  return [item.title, item.headline, item.analysis]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Detects analysis text that describes a failed retrieval (paywall, CAPTCHA,
 * access denial, empty extraction) rather than a real story. Used both by the
 * ingestion pipeline (hold for review) and by public display filtering.
 */
const FAILED_RETRIEVAL_PATTERNS: readonly RegExp[] = [
  // A paywall that blocked this retrieval — not ordinary coverage of paywalls.
  /paywall[^.]{0,40}\b(block|blocks|blocked|prevent|prevents|prevented|restrict|restricts|restricted|limits access)\b/i,
  /\b(block|blocked|prevented|restricted|limited|denied)\b[^.]{0,40}\bpaywall\b/i,
  /\b(behind|hidden behind|locked behind)\b[^.]{0,40}\bpaywall\b/i,
  /\b(article|content|page|report|story|source|site|website|piece)\b[^.]{0,20}\b(is|was|remains)?\s*paywalled\b/i,
  /\bpaywall(ed)?\b[^.]{0,30}\b(could not|cannot|unable|no content|not available)\b/i,
  /\b(no|without) (article )?content (was )?(available|retrieved|extracted)/i,
  /\b(is|was|remains) inaccessible\b/i,
  /\b(access|accessing) (to )?(the|this) (article|page|content|source)[^.]{0,40}(denied|blocked|restricted)/i,
  /\baccess (was )?denied\b/i,
  /\b(could|cannot|can'?t|unable to) (be )?(access|accessed|retrieve|retrieved|analysed|analyzed)\b/i,
  /\b(failed to access|inability to access|without access to)\b/i,
  /\bcaptcha\b/i,
  /\b(are you a robot|anti-?robot|verify you are (a )?human)\b/i,
  /\bsubscribe to (read|continue)\b/i,
  /\b403 forbidden\b/i,
  /\benable javascript\b/i,
];

export function failedRetrievalReason(text: string): string | null {
  const hit = FAILED_RETRIEVAL_PATTERNS.find((re) => re.test(text));
  return hit
    ? "Generated text describes a failed source retrieval (paywall, CAPTCHA, access denial or empty extraction)"
    : null;
}

const IRRELEVANT_PHRASES = ["digital inclusion", "cookie policy"];

/** True when the item is safe to show as a normal published news story. */
export function isPubliclyPresentable(item: NewsLike): boolean {
  const text = haystack(item);
  if (!text.trim()) return false;
  if (failedRetrievalReason(text)) return false;
  if (IRRELEVANT_PHRASES.some((p) => text.includes(p)) && !text.includes("energy")) return false;
  return true;
}

/** Convenience filter for lists. */
export function filterPresentableNews<T extends NewsLike>(items: T[]): T[] {
  return items.filter(isPubliclyPresentable);
}
