import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bell, CheckCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard, useDashboardMutation } from "@/hooks/useDashboardData";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/dashboard.functions";
import { PageHead, Panel, EmptyState, fmtDate } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard(!!user);
  const markOne = useDashboardMutation(useServerFn(markNotificationRead));
  const markAll = useDashboardMutation(useServerFn(markAllNotificationsRead));

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const hasUnread = data.notifications.some((n) => !n.read);

  return (
    <div>
      <PageHead
        title="Notifications"
        subtitle="Platform updates, saved-work reminders and topic alerts."
        action={
          hasUnread ? (
            <Button variant="outline" size="sm" onClick={() => markAll.mutate({} as never)}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
          ) : undefined
        }
      />
      {data.notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          desc="New notifications about your saved work and followed topics will appear here."
        />
      ) : (
        <div className="space-y-3">
          {data.notifications.map((n) => (
            <Panel
              key={n.id}
              className={`flex items-start gap-3 ${n.read ? "opacity-70" : "border-electric/30"}`}
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-electric">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{fmtDate(n.created_at)}</p>
              </div>
              {!n.read && (
                <Button variant="ghost" size="sm" onClick={() => markOne.mutate({ data: { id: n.id } })}>
                  Mark read
                </Button>
              )}
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
