import { createHmac, timingSafeEqual } from "crypto";

// HMAC key. LOVABLE_API_KEY is always present in this project and never
// shipped to the browser, so it's a safe signing secret for short-lived
// captcha tokens.
function getKey(): string {
  const k = process.env.LOVABLE_API_KEY;
  if (!k) throw new Error("LOVABLE_API_KEY is not configured");
  return k;
}

const TTL_MS = 10 * 60 * 1000; // 10 minutes

export type CaptchaChallenge = {
  question: string;
  token: string;
};

function sign(payload: string): string {
  return createHmac("sha256", getKey()).update(payload).digest("base64url");
}

export function issueChallenge(): CaptchaChallenge {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  const payload = `${answer}.${Date.now()}`;
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  return { question: `What is ${a} ${op} ${b}?`, token };
}

export function verifyChallenge(token: string, answer: string | number): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;
  const expectedSig = sign(Buffer.from(payloadB64, "base64url").toString());
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const payload = Buffer.from(payloadB64, "base64url").toString();
  const [answerStr, tsStr] = payload.split(".");
  const ts = Number(tsStr);
  if (!Number.isFinite(ts) || Date.now() - ts > TTL_MS) return false;
  return String(answer).trim() === answerStr;
}
