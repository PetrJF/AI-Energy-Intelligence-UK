import { useState } from "react";
import { Link2, Check, Mail } from "lucide-react";

type Props = {
  url: string;
  title: string;
  description?: string;
};

// Brand-ish glyphs kept inline so we don't depend on brand icon packs.
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.79l-5.32-6.56L4.4 22H1.64l6.98-7.97L1.5 2h6.94l4.8 5.98L18.24 2Zm-1.19 18.2h1.88L7.03 3.7H5.02l12.03 16.5Z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95H15.83c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z" />
  </svg>
);
const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M22 12.14a2.14 2.14 0 0 0-3.62-1.55c-1.42-.98-3.36-1.6-5.5-1.68l1.12-3.55 3.05.72a1.67 1.67 0 1 0 .15-.9l-3.4-.8a.42.42 0 0 0-.5.29l-1.28 4.06c-2.16.07-4.13.7-5.57 1.69A2.14 2.14 0 1 0 4 14.5c0 3.15 3.58 5.7 8 5.7s8-2.55 8-5.7c0-.44-.07-.87-.2-1.27A2.14 2.14 0 0 0 22 12.14ZM7 14.5a1.4 1.4 0 1 1 2.8 0 1.4 1.4 0 0 1-2.8 0Zm8.94 3.6c-1.06 1.06-3.1 1.15-3.94 1.15s-2.88-.09-3.94-1.15a.43.43 0 0 1 .6-.6c.67.66 2.1.9 3.34.9s2.67-.24 3.34-.9a.43.43 0 0 1 .6.6Zm-.34-2.2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.49 0 .14 5.34.14 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.32-1.66a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9a11.83 11.83 0 0 0-3.43-8.42ZM12.05 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.65-.24-.38a9.9 9.9 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.91 9.9Zm5.44-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.94-2.24-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
  </svg>
);

export function ShareButtons({ url, title, description = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const d = encodeURIComponent(description);

  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon, className: "hover:bg-foreground hover:text-background" },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedInIcon, className: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]" },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon, className: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]" },
    { label: "Share on Reddit", href: `https://www.reddit.com/submit?url=${u}&title=${t}`, Icon: RedditIcon, className: "hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]" },
    { label: "Share on WhatsApp", href: `https://api.whatsapp.com/send?text=${t}%20${u}`, Icon: WhatsAppIcon, className: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]" },
    { label: "Share by email", href: `mailto:?subject=${t}&body=${d}%0A%0A${u}`, Icon: Mail, className: "hover:bg-brand hover:text-primary-foreground hover:border-brand" },
  ];

  async function copy() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share</span>
      {links.map(({ label, href, Icon, className }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors ${className}`}
        >
          <Icon />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-brand"
      >
        {copied ? <Check className="h-4 w-4 text-brand" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
