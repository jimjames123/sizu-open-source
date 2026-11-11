import React, { useEffect, useState } from "react";
import { Search, MapPin, Tag, Target, User, Activity, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getIconContainerClasses } from "@/lib/form-utils";
import { useToast } from "@/hooks/use-toast";
import {
  buildProjectSearchParams,
  buildProjectsApiUrl,
  getActiveSearchFilterFromParams,
  getSearchQueryFromParams,
  PROJECT_SEARCH_FILTERS,
  PROJECT_SEARCH_TABS,
  type ProjectSearchFilter,
} from "@/lib/projectSearch";

const filterIcons: Record<ProjectSearchFilter, React.ReactNode> = {
  location: <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />,
  sector: <Tag className="h-4 w-4 sm:h-5 sm:w-5" />,
  sdg: <Target className="h-4 w-4 sm:h-5 sm:w-5" />,
  project: <Search className="h-4 w-4 sm:h-5 sm:w-5" />,
  target: <User className="h-4 w-4 sm:h-5 sm:w-5" />,
  status: <Activity className="h-4 w-4 sm:h-5 sm:w-5" />,
};

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<ProjectSearchFilter>(() =>
    getActiveSearchFilterFromParams(searchParams),
  );
  const [searchQuery, setSearchQuery] = useState(() => getSearchQueryFromParams(searchParams));

  useEffect(() => {
    setActiveFilter(getActiveSearchFilterFromParams(searchParams));
    setSearchQuery(getSearchQueryFromParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    console.log("activeFilter:", activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    console.log("searchQuery:", searchQuery);
  }, [searchQuery]);

  const handleTabChange = (nextFilter: ProjectSearchFilter) => {
    setActiveFilter(nextFilter);
    setSearchQuery("");
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      toast({
        title: "Enter a search value",
        description: `Please choose a ${PROJECT_SEARCH_TABS[activeFilter].label.toLowerCase()} value before searching.`,
        variant: "destructive",
      });
      return;
    }

    const nextParams = buildProjectSearchParams(activeFilter, trimmedQuery, searchParams);
    const apiUrl = buildProjectsApiUrl(nextParams);

    console.log("final API URL:", apiUrl);
    setSearchParams(nextParams);
  };

  const activeTab = PROJECT_SEARCH_TABS[activeFilter];

  return (
    <form onSubmit={handleSearch} className="w-full space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {PROJECT_SEARCH_FILTERS.map((filter) => {
          const config = PROJECT_SEARCH_TABS[filter];

          return (
            <button
              key={filter}
              type="button"
              onClick={() => handleTabChange(filter)}
              className={`flex min-h-11 w-full items-center justify-center rounded-full px-3 py-2 text-xs transition-all duration-200 sm:px-4 sm:text-sm ${
                activeFilter === filter
                  ? "bg-background text-foreground shadow-md"
                  : "bg-muted/40 text-foreground hover:bg-muted/60"
              }`}
            >
              {filterIcons[filter]}
              <span className="ml-2 truncate">{config.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        {activeTab.inputType === "text" ? (
          <div className="relative">
            <div className={getIconContainerClasses("left")}>{filterIcons[activeFilter]}</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={activeTab.placeholder}
              className="w-full rounded-lg bg-background py-3 pl-11 pr-4 text-sm text-foreground shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:py-4 sm:text-base"
            />
          </div>
        ) : (
          <div className="relative">
            <div className={getIconContainerClasses("left")}>{filterIcons[activeFilter]}</div>
            <select
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full appearance-none rounded-lg bg-background py-3 pl-11 pr-12 text-sm text-foreground shadow-md focus:outline-none focus:ring-2 focus:ring-ring sm:py-4 sm:text-base"
            >
              <option value="">{activeTab.placeholder}</option>
              {activeTab.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronDown className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="flex min-h-11 w-full items-center justify-center rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 sm:py-4"
      >
        <Search className="mr-2 h-5 w-5" />
        Search Projects
      </button>
    </form>
  );
};

export default SearchBar;
