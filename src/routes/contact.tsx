import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageSquare } from "lucide-react";
import { PageHero, ToolShell } from "@/components/ToolUI";
import { ContactEnquiryForm } from "@/components/ContactEnquiryForm";

const CONTACT_EMAIL = "info@aienergyintelligence.co.uk";
const SITE = "aienergyintelligence.co.uk";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AI Energy Intelligence UK" },
      { name: "description", content: "Get in touch with AI Energy Intelligence UK. Email us at info@aienergyintelligence.co.uk for questions about our AI energy tools, privacy or partnerships." },
      { property: "og:title", content: "Contact — AI Energy Intelligence UK" },
      { property: "og:description", content: "Contact AI Energy Intelligence UK via email." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        intro={`Questions about ${SITE}, our AI energy tools, or how we handle your data? Send us an email and we’ll get back to you as soon as we can.`}
      />
      <ToolShell>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-brand-foreground mb-4">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">Email us</h2>
            <p className="text-sm text-muted-foreground mb-4">
              For general enquiries, privacy questions, partnership opportunities or feedback on our tools.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:opacity-90"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">Response times</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We aim to respond to all enquiries within 2–3 business days. For urgent subscription or billing issues, please include your account email address.
            </p>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:opacity-90"
            >
              Read our Privacy Policy →
            </Link>
          </div>
        </div>

        <div className="mt-10 max-w-4xl">
          <ContactEnquiryForm />
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 max-w-4xl">
          <h2 className="font-display font-bold text-lg mb-2">Before you write</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Tool inputs are processed in your browser — we cannot see or recover your calculator entries.</li>
            <li>For account or billing help, email from the address associated with your subscription.</li>
            <li>We do not offer phone support; email is the fastest way to reach us.</li>
          </ul>
        </div>
      </ToolShell>
    </>
  );
}
