import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your AI Energy Dashboard — AI Energy Intelligence UK" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardShell,
});
