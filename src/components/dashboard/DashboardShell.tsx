import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Star,
  Bell,
  Eye,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/saved-calculations", label: "Saved Calculations", icon: Calculator },
  { to: "/dashboard/reports", label: "Reports", icon: FileText },
  { to: "/dashboard/favourites", label: "Favourites", icon: Star },
  { to: "/dashboard/watchlists", label: "Watchlists", icon: Eye },
  { to: "/dashboard/activity", label: "Recent Activity", icon: History },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardShell() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data } = useDashboard(!!user);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", search: { redirect: "/dashboard" } });
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  const unread = (data?.notifications ?? []).filter((n) => !n.read).length;

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="px-2 pb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your dashboard
              </div>
              <div className="mt-1 truncate text-sm font-medium text-foreground">{user.email}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Signed in
              </div>
            </div>
            <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
              {NAV.map((item) => {
                const active = "exact" in item && item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.to === "/dashboard/notifications" && unread > 0 && (
                      <span className="ml-auto rounded-full bg-electric px-1.5 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-border pt-3">
              <Button variant="outline" size="sm" className="w-full" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
