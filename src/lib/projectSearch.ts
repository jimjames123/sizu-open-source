import { ProjectProps } from "@/components/home/ProjectCard";
import { sectorOptions, sdgOptions, statusOptions } from "@/components/projects/ProjectForm";
import { TARGET_GROUP_OPTIONS } from "@/constants/targetGroups";
import { determineOrganizationName, normalizeStatus } from "@/utils/organizationUtils";
import { supabase } from "@/integrations/supabase/client";

export type ProjectSearchFilter =
  | "location"
  | "sector"
  | "sdg"
  | "project"
  | "target"
  | "status";

export type UnifiedSearchCategory = ProjectSearchFilter | "all";

export interface ProjectSearchOption {
  label: string;
  value: string;
}

export interface ProjectSearchTabConfig {
  label: string;
  placeholder: string;
  inputType: "text" | "select";
  options?: ProjectSearchOption[];
}

interface ProjectApiRecord {
  id: string;
  name: string;
  brief: string;
  location: string;
  sector: string;
  sdg: string;
  target_groups: string[] | null;
  status: string;
  start_date: string;
  end_date: string | null;
  image: string | null;
  organization_id: string;
  metadata: Record<string, unknown> | null;
  profiles?: {
    organization_name?: string | null;
  } | null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qrrziayuzfdfvkptywgt.supabase.co";
export const PROJECTS_API_PATH = `${SUPABASE_URL}/functions/v1/projects`;

export const PROJECT_SEARCH_FILTERS: ProjectSearchFilter[] = [
  "location",
  "sector",
  "sdg",
  "project",
  "target",
  "status",
];

export const UNIFIED_SEARCH_CATEGORIES: UnifiedSearchCategory[] = [
  "all",
  "project",
  "location",
  "sector",
  "sdg",
  "target",
  "status",
];

const SEARCH_FILTER_KEYS = new Set<string>([
  ...PROJECT_SEARCH_FILTERS,
  "name",
  "q",
  "status",
]);

export const PROJECT_SEARCH_TABS: Record<ProjectSearchFilter, ProjectSearchTabConfig> = {
  location: {
    label: "Location",
    placeholder: "Search by location...",
    inputType: "text",
  },
  sector: {
    label: "Sector",
    placeholder: "Select sector",
    inputType: "select",
    options: sectorOptions.map((option) => ({ label: option, value: option })),
  },
  sdg: {
    label: "SDG",
    placeholder: "Select Sustainable Development Goal",
    inputType: "select",
    options: sdgOptions.map((option, index) => ({
      label: option.label,
      value: String(index + 1),
    })),
  },
  project: {
    label: "Project",
    placeholder: "Search by project name...",
    inputType: "text",
  },
  target: {
    label: "Target",
    placeholder: "Select target group",
    inputType: "select",
    options: TARGET_GROUP_OPTIONS.map((option) => ({
      label: option.label,
      value: option.value,
    })),
  },
  status: {
    label: "Status",
    placeholder: "Select project status",
    inputType: "select",
    options: statusOptions.map((option) => ({
      label: option
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: option,
    })),
  },
};

export const UNIFIED_SEARCH_LABELS: Record<UnifiedSearchCategory, string> = {
  all: "All",
  project: "Project Name",
  location: "Location",
  sector: "Sector",
  sdg: "SDG",
  target: "Target Group",
  status: "Status",
};

export const getActiveSearchFilterFromParams = (
  searchParams: URLSearchParams,
): ProjectSearchFilter => {
  if (searchParams.get("project") || searchParams.get("name")) {
    return "project";
  }

  for (const filter of PROJECT_SEARCH_FILTERS) {
    if (filter !== "project" && searchParams.get(filter)) {
      return filter;
    }
  }

  return "location";
};

export const getSearchQueryFromParams = (searchParams: URLSearchParams): string => {
  const activeFilter = getActiveSearchFilterFromParams(searchParams);

  if (activeFilter === "project") {
    return searchParams.get("project") ?? searchParams.get("name") ?? "";
  }

  return searchParams.get(activeFilter) ?? "";
};

export const buildProjectSearchParams = (
  activeFilter: ProjectSearchFilter,
  searchQuery: string,
  existingParams?: URLSearchParams,
) => {
  const params = new URLSearchParams(existingParams?.toString());

  SEARCH_FILTER_KEYS.forEach((key) => params.delete(key));

  const trimmedQuery = searchQuery.trim();
  if (trimmedQuery) {
    params.set(activeFilter, trimmedQuery);
  }

  return params;
};

export interface ActiveFilter {
  key: ProjectSearchFilter;
  value: string;
  label: string;
}

export const getActiveFiltersFromParams = (searchParams: URLSearchParams): ActiveFilter[] => {
  const filters: ActiveFilter[] = [];

  for (const key of PROJECT_SEARCH_FILTERS) {
    const value = searchParams.get(key);
    if (value && value.trim()) {
      const config = PROJECT_SEARCH_TABS[key];
      const displayValue =
        config.options?.find((option) => option.value === value)?.label ?? value;
      filters.push({
        key,
        value,
        label: `${config.label}: ${displayValue}`,
      });
    }
  }

  return filters;
};

export const removeFilterFromParams = (
  searchParams: URLSearchParams,
  key: string,
): URLSearchParams => {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.delete(key);
  return nextParams;
};

export const buildUnifiedSearchParams = (
  category: UnifiedSearchCategory,
  query: string,
  existingParams?: URLSearchParams,
): URLSearchParams => {
  const params = new URLSearchParams(existingParams?.toString());

  SEARCH_FILTER_KEYS.forEach((key) => params.delete(key));

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return params;
  }

  if (category === "all") {
    params.set("q", trimmedQuery);
  } else {
    params.set(category, trimmedQuery);
  }

  return params;
};

export const buildProjectsApiUrl = (paramsSource: URLSearchParams | string) => {
  if (typeof paramsSource === "string" && paramsSource.startsWith(PROJECTS_API_PATH)) {
    return paramsSource;
  }

  const sourceParams =
    paramsSource instanceof URLSearchParams
      ? paramsSource
      : new URLSearchParams(paramsSource);

  const apiParams = new URLSearchParams();

  const q = sourceParams.get("q");
  if (q) {
    apiParams.set("q", q);
  }

  PROJECT_SEARCH_FILTERS.forEach((filter) => {
    const value = sourceParams.get(filter);
    if (value) {
      apiParams.set(filter, value);
    }
  });

  if (!apiParams.get("project")) {
    const legacyProjectValue = sourceParams.get("name");
    if (legacyProjectValue) {
      apiParams.set("project", legacyProjectValue);
    }
  }

  const queryString = apiParams.toString();
  return queryString ? `${PROJECTS_API_PATH}?${queryString}` : PROJECTS_API_PATH;
};

const mapProjectRecord = (project: ProjectApiRecord): ProjectProps => ({
  id: project.id,
  name: project.name,
  organization: determineOrganizationName(project),
  organization_id: project.organization_id,
  location: project.location,
  sector: project.sector,
  sdg: project.sdg,
  targetGroups: project.target_groups ?? [],
  status: normalizeStatus(project.status),
  startDate: project.start_date,
  endDate: project.end_date ?? undefined,
  image: project.image ?? "",
  brief: project.brief,
});

export const fetchProjects = async (
  paramsSource: URLSearchParams | string,
): Promise<ProjectProps[]> => {
  const apiUrl = buildProjectsApiUrl(paramsSource);
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to fetch projects (${response.status})`);
  }

  const data = (await response.json()) as ProjectApiRecord[];
  // The public Edge Function may return projects without readable profile joins.
  // Resolve each account's name independently, using only public, RLS-visible records.
  const ids = [...new Set(data.map(project => project.organization_id).filter(Boolean))];
  const names = new Map<string, string>();
  if (ids.length) {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, organization_name")
      .in("id", ids);
    if (profileError) console.warn("Unable to resolve public organization profiles:", profileError.message);
    for (const profile of profiles ?? []) {
      if (profile.organization_name?.trim()) names.set(profile.id, profile.organization_name.trim());
    }
    const unresolved = ids.filter(id => !names.has(id));
    if (unresolved.length) {
      const { data: organizations, error: organizationError } = await supabase
        .from("organizations")
        .select("id, name")
        .in("id", unresolved);
      if (organizationError) console.warn("Unable to resolve public organizations:", organizationError.message);
      for (const org of organizations ?? []) {
        if (org.name?.trim()) names.set(org.id, org.name.trim());
      }
    }
  }
  return data.map(project => ({
    ...mapProjectRecord(project),
    organization: names.get(project.organization_id) ?? determineOrganizationName(project),
  }));
};
