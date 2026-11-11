import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Search, X, MapPin, Tag, Target, User, Activity, FileText, ChevronDown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProjectProps } from "@/components/home/ProjectCard";
import {
  fetchProjects,
  buildUnifiedSearchParams,
  getActiveFiltersFromParams,
  removeFilterFromParams,
  PROJECT_SEARCH_TABS,
  UNIFIED_SEARCH_LABELS,
  UNIFIED_SEARCH_CATEGORIES,
  type ProjectSearchFilter,
  type UnifiedSearchCategory,
} from "@/lib/projectSearch";

const categoryIcons: Record<UnifiedSearchCategory, React.ReactNode> = {
  all: <Search className="h-4 w-4" />,
  project: <FileText className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  sector: <Tag className="h-4 w-4" />,
  sdg: <Target className="h-4 w-4" />,
  target: <User className="h-4 w-4" />,
  status: <Activity className="h-4 w-4" />,
};

interface SuggestionGroup {
  category: UnifiedSearchCategory;
  projects: ProjectProps[];
}

const UnifiedProjectSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialCategory = (searchParams.get("category") as UnifiedSearchCategory) || "all";
  const initialQuery = useMemo(() => {
    return (
      searchParams.get("q") ??
      searchParams.get("project") ??
      searchParams.get("name") ??
      ""
    );
  }, [searchParams]);

  const [category, setCategory] = useState<UnifiedSearchCategory>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryOptions = useMemo(() => {
    if (category === "all") return undefined;
    return PROJECT_SEARCH_TABS[category as ProjectSearchFilter]?.options;
  }, [category]);

  const filteredOptions = useMemo(() => {
    if (!categoryOptions) return [];
    // Once an option is committed, show the full list again so the user can
    // change their selection instead of being locked to the chosen value.
    if (selectedOptionValue) return categoryOptions;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return categoryOptions;
    return categoryOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [categoryOptions, query, selectedOptionValue]);

  const activeFilters = useMemo(
    () => getActiveFiltersFromParams(searchParams),
    [searchParams],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
        setIsSuggestionsOpen(false);
        setIsOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadSuggestions = useCallback(
    async (searchQuery: string, searchCategory: UnifiedSearchCategory) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const params = buildUnifiedSearchParams(searchCategory, searchQuery);
        const results = await fetchProjects(params);

        const groups: SuggestionGroup[] = [];

        if (searchCategory === "all") {
          const normalizedQuery = searchQuery.toLowerCase();

          const byName = results.filter((project) =>
            project.name.toLowerCase().includes(normalizedQuery),
          );
          const byLocation = results.filter((project) =>
            project.location.toLowerCase().includes(normalizedQuery),
          );
          const bySector = results.filter((project) =>
            project.sector.toLowerCase().includes(normalizedQuery),
          );
          const bySdg = results.filter((project) =>
            project.sdg.toLowerCase().includes(normalizedQuery),
          );
          const byTarget = results.filter((project) =>
            project.targetGroups.some((group) =>
              group.toLowerCase().includes(normalizedQuery),
            ),
          );

          if (byName.length) groups.push({ category: "project", projects: byName });
          if (byLocation.length) groups.push({ category: "location", projects: byLocation });
          if (bySector.length) groups.push({ category: "sector", projects: bySector });
          if (bySdg.length) groups.push({ category: "sdg", projects: bySdg });
          if (byTarget.length) groups.push({ category: "target", projects: byTarget });
        } else {
          if (results.length) {
            groups.push({ category: searchCategory, projects: results });
          }
        }

        setSuggestions(groups);
      } catch (error: any) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (categoryOptions) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      if (query.trim()) {
        loadSuggestions(query, category);
        setIsSuggestionsOpen(true);
      } else {
        setSuggestions([]);
        setIsSuggestionsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, category, categoryOptions, loadSuggestions]);

  const handleSearch = (event?: React.FormEvent) => {
    event?.preventDefault();

    // For option-driven categories, search with the committed option value
    // (e.g. SDG number), not the display label shown in the input.
    const trimmedQuery =
      categoryOptions && selectedOptionValue ? selectedOptionValue : query.trim();
    if (!trimmedQuery) {
      toast({
        title: "Enter a search term",
        description: "Please type something to search for projects.",
        variant: "destructive",
      });
      return;
    }

    const nextParams = buildUnifiedSearchParams(category, trimmedQuery, searchParams);
    nextParams.delete("category");
    setSearchParams(nextParams);
    setIsSuggestionsOpen(false);
    setIsCategoryOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    setIsSuggestionsOpen(false);
    setIsCategoryOpen(false);
    navigate(`/projects/${projectId}`);
  };

  const handleApplyCategoryFilter = (
    filterKey: ProjectSearchFilter,
    filterValue: string,
  ) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("q");
    nextParams.delete(filterKey);
    nextParams.set(filterKey, filterValue);
    setSearchParams(nextParams);
    setIsSuggestionsOpen(false);
    setIsCategoryOpen(false);
  };

  const handleRemoveFilter = (key: string) => {
    const nextParams = removeFilterFromParams(searchParams, key);
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setQuery("");
    setSelectedOptionValue(null);
    setCategory("all");
    setSearchParams(new URLSearchParams());
    setIsSuggestionsOpen(false);
    setIsCategoryOpen(false);
  };

  const handleCategoryChange = (nextCategory: UnifiedSearchCategory) => {
    setCategory(nextCategory);
    setIsCategoryOpen(false);
    setQuery("");
    setSelectedOptionValue(null);
    const nextOptions =
      nextCategory === "all"
        ? undefined
        : PROJECT_SEARCH_TABS[nextCategory as ProjectSearchFilter]?.options;
    if (nextOptions) {
      setIsOptionsOpen(true);
      setIsSuggestionsOpen(false);
    } else if (query.trim()) {
      loadSuggestions(query, nextCategory);
      setIsSuggestionsOpen(true);
    }
  };

  const handleSelectOption = (filterKey: ProjectSearchFilter, optionValue: string) => {
    const label =
      PROJECT_SEARCH_TABS[filterKey].options?.find((option) => option.value === optionValue)
        ?.label ?? optionValue;
    setSelectedOptionValue(optionValue);
    setQuery(label);
    setIsOptionsOpen(false);
    handleApplyCategoryFilter(filterKey, optionValue);
  };

  const handleClearOption = () => {
    setSelectedOptionValue(null);
    setQuery("");
    setIsOptionsOpen(false);
    if (category !== "all") {
      setSearchParams(removeFilterFromParams(searchParams, category));
    }
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="w-full">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative sm:w-44 shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {categoryIcons[category]}
                  {UNIFIED_SEARCH_LABELS[category]}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                  {UNIFIED_SEARCH_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleCategoryChange(cat);
                        inputRef.current?.focus();
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        category === cat
                          ? "bg-sizu-red/10 text-sizu-red font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {categoryIcons[cat]}
                      {UNIFIED_SEARCH_LABELS[cat]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-grow">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (selectedOptionValue) setSelectedOptionValue(null);
                  if (categoryOptions) setIsOptionsOpen(true);
                }}
                onFocus={() => {
                  if (categoryOptions) {
                    setIsOptionsOpen(true);
                  } else if (query.trim()) {
                    setIsSuggestionsOpen(true);
                  }
                }}
                placeholder={
                  categoryOptions
                    ? `Select ${UNIFIED_SEARCH_LABELS[category].toLowerCase()}...`
                    : `Search by ${UNIFIED_SEARCH_LABELS[category].toLowerCase()}...`
                }
                className="w-full rounded-lg bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sizu-red/30"
              />
              {categoryOptions && (
                <button
                  type="button"
                  onClick={() => setIsOptionsOpen((open) => !open)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle options"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOptionsOpen ? "rotate-180" : ""}`} />
                </button>
              )}
              {query && !categoryOptions && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {categoryOptions && selectedOptionValue && (
                <button
                  type="button"
                  onClick={handleClearOption}
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {categoryOptions && isOptionsOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-72 overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No matching {UNIFIED_SEARCH_LABELS[category].toLowerCase()} options.
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          handleSelectOption(category as ProjectSearchFilter, option.value)
                        }
                        className="w-full px-4 py-2.5 text-left text-sm !text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        {option.label}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="shrink-0 px-6 py-3 bg-sizu-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/80">Active filters:</span>
            {activeFilters.map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full"
              >
                {filter.label}
                <button
                  type="button"
                  onClick={() => handleRemoveFilter(filter.key)}
                  className="hover:text-white/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-white/80 hover:text-white underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}
      </form>

      {isSuggestionsOpen && query.trim() && (
        <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-900">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-sizu-red mr-2" />
              Searching...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No projects found for "{query}". Try a different term.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((group) => (
                <div key={group.category} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    {categoryIcons[group.category]}
                    {UNIFIED_SEARCH_LABELS[group.category]}
                  </div>
                  <div className="divide-y divide-gray-50">
                    {group.projects.slice(0, 4).map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => handleSelectProject(project.id)}
                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-500">
                              {project.name
                                .split(" ")
                                .slice(0, 2)
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="text-sm font-medium !text-gray-900 truncate">
                            {project.name}
                          </div>
                          <div className="text-xs !text-gray-500 truncate">
                            {project.organization} • {project.location} • {project.sector}
                          </div>
                        </div>
                        <div className="shrink-0 text-xs !text-sizu-red font-medium">
                          View
                        </div>
                      </button>
                    ))}
                    {group.projects.length > 4 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCategoryFilter(
                            group.category as ProjectSearchFilter,
                            query,
                          )
                        }
                        className="w-full px-4 py-2 text-sm text-sizu-red hover:bg-gray-50 transition-colors text-left"
                      >
                        See all {group.projects.length} {UNIFIED_SEARCH_LABELS[group.category].toLowerCase()} matches
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedProjectSearch;
