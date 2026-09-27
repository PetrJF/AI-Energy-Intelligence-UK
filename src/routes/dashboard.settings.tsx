import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard, useDashboardMutation } from "@/hooks/useDashboardData";
import { saveSettings } from "@/lib/dashboard.functions";
import { PageHead, Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);
  const save = useDashboardMutation(useServerFn(saveSettings));

  const [units, setUnits] = useState("metric");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [defaultLanding, setDefaultLanding] = useState("/dashboard");

  useEffect(() => {
    if (data?.settings) {
      setUnits(data.settings.units);
      setEmailNotifications(data.settings.email_notifications);
      setDefaultLanding(data.settings.default_landing);
    }
  }, [data?.settings]);

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const onSave = () =>
    save.mutate(
      { data: { units, emailNotifications, defaultLanding } },
      { onSuccess: () => toast.success("Settings saved") },
    );

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div>
      <PageHead title="Settings" subtitle="Personalise your dashboard experience." />

      <div className="space-y-4">
        <Panel>
          <label className="text-sm font-semibold text-foreground">Preferred units</label>
          <p className="mb-3 text-xs text-muted-foreground">Used where tools show volume and weight.</p>
          <div className="flex gap-2">
            {[
              { v: "metric", l: "Metric (kWh, m³)" },
              { v: "imperial", l: "Imperial" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setUnits(o.v)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  units === o.v ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <label className="text-sm font-semibold text-foreground">Default landing page</label>
          <p className="mb-3 text-xs text-muted-foreground">Where the dashboard opens first.</p>
          <select
            value={defaultLanding}
            onChange={(e) => setDefaultLanding(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="/dashboard">Overview</option>
            <option value="/dashboard/saved-calculations">Saved Calculations</option>
            <option value="/dashboard/reports">Reports</option>
            <option value="/dashboard/favourites">Favourites</option>
          </select>
        </Panel>

        <Panel className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-foreground">Email notifications</div>
            <p className="text-xs text-muted-foreground">Updates about your saved work and topics.</p>
          </div>
          <button
            role="switch"
            aria-checked={emailNotifications}
            onClick={() => setEmailNotifications((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              emailNotifications ? "bg-primary" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                emailNotifications ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </Panel>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button onClick={onSave} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save settings"}
          </Button>
          <Button variant="outline" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
