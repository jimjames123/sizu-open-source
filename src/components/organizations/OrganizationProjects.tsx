
import React, { useEffect } from "react";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { ProjectProps } from "@/components/home/ProjectCard";

interface OrganizationProjectsProps {
  organizationName: string;
  projects: ProjectProps[];
}

const OrganizationProjects: React.FC<OrganizationProjectsProps> = ({ 
  organizationName, 
  projects 
}) => {
  // Move console logs to useEffect to avoid render cycle issues
  useEffect(() => {
    console.log("OrganizationProjects effect with:", {
      organizationName,
      projectsCount: projects?.length || 0,
      projects
    });
  }, [organizationName, projects]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Projects by {organizationName}
      </h2>
      
      {projects && projects.length > 0 ? (
        <ProjectGrid projects={projects} showFilters={false} />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
          <p className="text-gray-600">
            This organization hasn't added any projects yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationProjects;
