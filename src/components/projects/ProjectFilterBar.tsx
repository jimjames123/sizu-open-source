import { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  PROJECT_SEARCH_TABS,
  getActiveFiltersFromParams,
  removeFilterFromParams,
  type ProjectSearchFilter,
} from "@/lib/projectSearch";

const ALL = "__all__";

interface ProjectFilterBarProps {
  resultCount?: number;
  isLoading?: boolean;
}

const dropdowns: { key: ProjectSearchFilter; placeholder: string; allLabel: string }[] = [
  { key: "sector", placeholder: "Sector", allLabel: "All Sectors" },
  { key: "sdg", placeholder: "SDG", allLabel: "All SDGs" },
  { key: "target", placeholder: "Target Group", allLabel: "All Target Groups" },
  { key: "status", placeholder: "Status", allLabel: "Any Status" },
];

const ProjectFilterBar = ({ resultCount, isLoading }: ProjectFilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const activeFilters = useMemo(
    () => getActiveFiltersFromParams(searchParams),
    [searchParams],
  );

  const sort = searchParams.get("sort") ?? "newest";

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value && value.trim() && value !== ALL) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setParam("q", query);
  };

  const handleClearAll = () => {
    setQuery("");
    setSearchParams(new URLSearchParams());
  };

  const hasAnyFilter = activeFilters.length > 0 || !!searchParams.get("q");

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects by name, location, sector or SDG..."
            className="w-full h-12 rounded-xl border border-input bg-background pl-12 pr-28 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setParam("q", null);
              }}
              className="absolute right-[6.5rem] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 rounded-lg"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </span>

          {dropdowns.map(({ key, placeholder, allLabel }) => {
            const config = PROJECT_SEARCH_TABS[key];
            const value = searchParams.get(key) ?? ALL;

            return (
              <Select
                key={key}
                value={value}
                onValueChange={(next) => setParam(key, next === ALL ? null : next)}
              >
                <SelectTrigger className="h-10 w-[calc(50%-0.25rem)] sm:w-auto sm:min-w-[9.5rem] rounded-full border-border bg-background text-sm">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50 max-h-72">
                  <SelectItem value={ALL}>{allLabel}</SelectItem>
                  {config.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}

          <div className="sm:ml-auto w-full sm:w-auto">
            <Select value={sort} onValueChange={(next) => setParam("sort", next === "newest" ? null : next)}>
              <SelectTrigger className="h-10 w-full sm:w-[11rem] rounded-full border-border bg-background text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="alphabetical">A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>

      {(hasAnyFilter || typeof resultCount === "number") && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isLoading
              ? "Searching..."
              : `Showing ${resultCount ?? 0} project${resultCount === 1 ? "" : "s"}`}
          </span>

          {searchParams.get("q") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Search: {searchParams.get("q")}
              <button type="button" onClick={() => setParam("q", null)} aria-label="Remove search">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {filter.label}
              <button
                type="button"
                onClick={() => setSearchParams(removeFilterFromParams(searchParams, filter.key))}
                aria-label={`Remove ${filter.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {hasAnyFilter && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-medium text-primary underline underline-offset-2 hover:opacity-80"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilterBar;
