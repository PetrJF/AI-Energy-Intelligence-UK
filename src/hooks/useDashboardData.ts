import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardOverview } from "@/lib/dashboard.functions";

export type DashboardData = Awaited<ReturnType<typeof getDashboardOverview>>;

export const DASHBOARD_KEY = ["dashboard-overview"] as const;

/** Loads the full dashboard payload for the signed-in user. */
export function useDashboard(enabled: boolean) {
  const fetchOverview = useServerFn(getDashboardOverview);
  return useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: () => fetchOverview(),
    enabled,
    staleTime: 30_000,
  });
}

/** Wraps a dashboard server fn as a mutation that refreshes the overview. */
export function useDashboardMutation<TInput, TOutput>(
  fn: (input: TInput) => Promise<TOutput>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
