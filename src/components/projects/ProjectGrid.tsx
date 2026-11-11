
import React, { useState } from "react";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import ProjectCard, { ProjectProps } from "../home/ProjectCard";
import { getIconContainerClasses, getSearchInputClasses, getSearchSelectClasses, getIconClasses } from "@/lib/form-utils";
import { statusOptions } from "@/components/projects/ProjectForm";

interface ProjectGridProps {
  projects: ProjectProps[];
  showFilters?: boolean;
}

const ProjectGrid = ({ projects: initialProjects, showFilters = true }: ProjectGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filteredProjects, setFilteredProjects] = useState<ProjectProps[]>(initialProjects);

  // Status mapping for display and filtering consistency
  const displayStatusMap: Record<string, string> = {
    'planning': 'Planning',
    'active': 'Active',
    'completed': 'Completed',
    'on_hold': 'On Hold',
    'cancelled': 'Cancelled',
  };

  React.useEffect(() => {
    let result = [...initialProjects];
    
    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.brief.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      // Log the status filter for debugging
      console.log("Filtering by status:", statusFilter);
      console.log("Available projects:", initialProjects.map(p => p.status));
      
      result = result.filter((project) => {
        const projectStatus = project.status.replace("-", "_");
        console.log(`Comparing project status '${projectStatus}' with filter '${statusFilter}'`);
        return projectStatus === statusFilter;
      });
    }
    
    if (sortOption === "newest") {
      result = result.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else if (sortOption === "alphabetical") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProjects(result);
  }, [initialProjects, searchTerm, statusFilter, sortOption]);

  return (
    <div>
      {showFilters && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className={getIconContainerClasses('left')}>
                <Search className={getIconClasses()} />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full form-input bg-white text-gray-900"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="w-48">
                <div className="relative">
                  <div className={getIconContainerClasses('left')}>
                    <Filter className={getIconClasses()} />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 w-full form-input appearance-none bg-white text-gray-900"
                  >
                    <option value="all">All Projects</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {displayStatusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className={getIconContainerClasses('right')}>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="w-48">
                <div className="relative">
                  <div className={getIconContainerClasses('left')}>
                    <ArrowUpDown className={getIconClasses()} />
                  </div>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="pl-10 w-full form-input appearance-none bg-white text-gray-900"
                  >
                    <option value="newest">Newest First</option>
                    <option value="alphabetical">A to Z</option>
                  </select>
                  <div className={getIconContainerClasses('right')}>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
