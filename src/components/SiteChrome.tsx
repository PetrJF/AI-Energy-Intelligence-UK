import { Link } from "@tanstack/react-router";
import { navClick, trackNavClick } from "@/lib/nav-analytics";
import { ArrowRight, Menu, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getIsAdmin } from "@/lib/admin.functions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function useIsAdmin(enabled: boolean) {
  const fetchIsAdmin = useServerFn(getIsAdmin);
  const q = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => fetchIsAdmin(),
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  return !!q.data?.isAdmin;
}

const primaryNav = [
  { to: "/uk-data-centre-tracker", label: "Real Pipeline" },
  { to: "/reality-score", label: "Reality Score" },
  { to: "/ai-growth-zones", label: "AI Growth Zones" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
] as const;

const CTA = {
  to: "/",
  hash: "real-pipeline-signup",
  label: "Get the Real Pipeline",
} as const;

function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = useIsAdmin(!!user);
  const close = () => setOpen(false);
  const go = (label: string, href: string) => () => {
    trackNavClick("mobile", label, href);
    close();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] overflow-y-auto sm:w-[380px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col" aria-label="Mobile navigation">
          {primaryNav.map((item) => (
            <div key={item.to} className="border-b border-border">
              <Link
                to={item.to}
                onClick={go(item.label, item.to)}
                className="block py-4 text-base font-medium text-foreground hover:text-brand"
                activeProps={{ className: "block py-4 text-base font-medium text-brand" }}
              >
                {item.label}
              </Link>
            </div>
          ))}
          <div className="mt-4 border-b border-border">
            {user ? (
              <Link
                to="/dashboard"
                onClick={go("Dashboard", "/dashboard")}
                className="block py-4 text-base font-medium text-foreground hover:text-brand"
              >
                Dashboard
              </Link>
            ) : null}
            {isAdmin && (
              <Link
                to="/AIAdmin"
                onClick={go("Admin", "/AIAdmin")}
                className="block border-t border-border py-4 text-base font-medium text-brand hover:opacity-90"
              >
                Admin
              </Link>
            )}
          </div>

          <Link
            to={CTA.to}
            hash={CTA.hash}
            onClick={go(CTA.label, CTA.to)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {CTA.label}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin(!!user);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link
          to="/"
          onClick={navClick("header", "Logo (home)", "/")}
          className="group flex items-center gap-2"
        >
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient font-display font-bold text-brand-foreground shadow-elegant"
          >
            A
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-foreground">AI Energy Intelligence UK</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Independent research
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={navClick("header", item.label, item.to)}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/dashboard"
              onClick={navClick("header", "Dashboard", "/dashboard")}
              className="hidden items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground xl:inline-flex"
            >
              Dashboard
            </Link>
          ) : null}
          {isAdmin && (
            <Link
              to="/AIAdmin"
              onClick={navClick("header", "Admin", "/AIAdmin")}
              className="hidden items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-brand transition-colors hover:opacity-90 xl:inline-flex"
              title="Admin"
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          <MobileNav />
          <Link
            to={CTA.to}
            hash={CTA.hash}
            onClick={navClick("header", CTA.label, CTA.to)}
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <span className="hidden xl:inline">{CTA.label}</span>
            <span className="xl:hidden">Real Pipeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

type FooterPath = ComponentProps<typeof Link>["to"];

function FooterLink({ to, label }: { to: FooterPath; label: string }) {
  return (
    <li>
      <Link
        to={to}
        onClick={navClick("footer", label, String(to))}
        className="hover:text-foreground"
      >
        {label}
      </Link>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient font-display font-bold text-brand-foreground">A</div>
            <span className="font-display text-lg font-bold">AI Energy Intelligence UK</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Independent UK intelligence on AI electricity demand, data-centre growth and grid infrastructure.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h4 className="mb-3 text-sm font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink to="/uk-data-centre-tracker" label="UK Data Centre Tracker" />
              <FooterLink to="/reality-score" label="Reality Score" />
              <FooterLink to="/ai-growth-zones" label="AI Growth Zones" />
              <FooterLink to="/services" label="Services" />
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Archive</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink to="/uk-ai-energy-index" label="UK AI Energy Index" />
              <FooterLink to="/tools" label="Tools & calculators" />
              <FooterLink to="/reports" label="Reports" />
              <FooterLink to="/blog" label="Latest Analysis" />
              <FooterLink to="/news" label="News" />
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink to="/about" label="About" />
              <FooterLink to="/contact" label="Contact" />
              <FooterLink to="/services" label="Services" />
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Editorial standards</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink to="/editorial-team" label="Editorial team" />
              <FooterLink to="/editorial-standards" label="Editorial policy" />
              <FooterLink to="/corrections" label="Corrections policy" />
              <FooterLink to="/research-methodology" label="Research methodology" />
              <FooterLink to="/ai-use-and-conflicts" label="AI use & conflicts" />
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <FooterLink to="/terms" label="Terms of Use" />
              <FooterLink to="/refunds" label="Refunds" />
              <FooterLink to="/privacy" label="Privacy Policy" />
              <li>
                <button
                  onClick={() => import("./CookieConsent").then((m) => m.openConsent())}
                  className="hover:text-foreground"
                >
                  Cookie preferences
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} AI Energy Intelligence UK. Independent UK data-centre intelligence.</span>
          <span>aienergyintelligence.co.uk</span>
        </div>
      </div>
    </footer>
  );
}

