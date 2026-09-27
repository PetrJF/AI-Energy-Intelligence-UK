import { queryOptions } from "@tanstack/react-query";
import { getIndexSections } from "@/lib/index-sections.functions";
import { getIndexFramework } from "@/lib/index-framework.functions";

export const indexSectionsQueryOptions = queryOptions({
  queryKey: ["uk-ai-energy-index", "sections"],
  queryFn: () => getIndexSections(),
  staleTime: 5 * 60 * 1000,
});

/** Editions, indicators, datapoints and revision history for the index. */
export const indexFrameworkQueryOptions = queryOptions({
  queryKey: ["uk-ai-energy-index", "framework"],
  queryFn: () => getIndexFramework(),
  staleTime: 5 * 60 * 1000,
});
