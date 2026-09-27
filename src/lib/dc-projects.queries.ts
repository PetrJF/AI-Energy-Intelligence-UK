import { queryOptions } from "@tanstack/react-query";
import { listDcProjects } from "@/lib/dc-projects.functions";
import { isPhysicalFacility } from "@/lib/dc-projects";

export const publishedDcProjectsQueryOptions = queryOptions({
  queryKey: ["dc-tracker", "published"],
  queryFn: () => listDcProjects(),
  staleTime: 5 * 60 * 1000,
});

export function publishedFacilityCount(
  projects: Awaited<ReturnType<typeof listDcProjects>>,
): number {
  return projects.filter((project) => isPhysicalFacility(project.project_type)).length;
}