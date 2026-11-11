
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Target, Tag, Users, Building, Image, FileText, Milestone, User, Globe } from "lucide-react";
import { ProjectProps } from "../../components/home/ProjectCard";
import { OrganizationInfo } from "./OrganizationResolver";

interface ProjectInfoProps {
  project: ProjectProps;
  organizationInfo: OrganizationInfo | null;
  initials: string;
}

const ProjectInfo = ({ project, organizationInfo, initials }: ProjectInfoProps) => {
  // Format status for display
  const formatStatus = (status: string): string => {
    if (status === "on_hold") return "On Hold";
    return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  // Check if project has metadata
  const metadata = (project as any).metadata || {};
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-80">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-sizu-red/90 to-sizu-red text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="text-6xl font-bold mb-3">{initials}</div>
              <Image className="h-12 w-12 opacity-50" />
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-90 shadow-sm">
            {formatStatus(project.status)}
          </span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project?.name}</h1>
            {project?.organization_id ? (
              <div>
                <Link
                  to={`/organizations/${project.organization_id}`}
                  className="text-xl text-sizu-red hover:text-red-700 transition-colors"
                >
                  {project.organization}
                </Link>
                {organizationInfo && organizationInfo.confidence < 100 && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Confidence: {organizationInfo.confidence}%)
                  </span>
                )}
              </div>
            ) : (
              <div>
                <p className="text-xl text-gray-600">{project?.organization}</p>
                {organizationInfo && organizationInfo.confidence < 100 && (
                  <span className="text-sm text-gray-500">
                    (Confidence: {organizationInfo.confidence}%)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {project.sector}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {project.sdg}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-sizu-red mt-0.5" />
                <div>
                  <span className="block text-sm font-medium text-gray-600">Location</span>
                  <span className="block text-gray-900">{project.location}</span>
                  {metadata.region && (
                    <span className="block text-gray-700 mt-1">
                      Region: {metadata.region}
                      {metadata.district && `, District: ${metadata.district}`}
                      {metadata.parish && `, Parish: ${metadata.parish}`}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-sizu-red mt-0.5" />
                <div>
                  <span className="block text-sm font-medium text-gray-600">Timeline</span>
                  <span className="block text-gray-900">
                    {new Date(project.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}` : " - Ongoing"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start">
                <Target className="h-5 w-5 mr-3 text-sizu-black mt-0.5" />
                <div>
                  <span className="block text-sm font-medium text-gray-600">Sustainable Development Goal</span>
                  <span className="block text-gray-900">{project.sdg}</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-3 text-sizu-yellow mt-0.5" />
                <div>
                  <span className="block text-sm font-medium text-gray-600">Sector</span>
                  <span className="block text-gray-900">{project.sector}</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-sizu-yellow mt-0.5" />
                <div>
                  <span className="block text-sm font-medium text-gray-600">Target Groups</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.targetGroups.map((group, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {metadata.projectImplementer && (
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 text-sizu-red mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium text-gray-600">Project Team</span>
                    <span className="block text-gray-900">Implementer: {metadata.projectImplementer}</span>
                    {metadata.projectTeamLead && (
                      <span className="block text-gray-900">Team Lead: {metadata.projectTeamLead}</span>
                    )}
                    {metadata.otherPartners && (
                      <span className="block text-gray-900">Other Partners: {metadata.otherPartners}</span>
                    )}
                  </div>
                </div>
              )}

              {metadata.implementersWebsite && (
                <div className="flex items-start">
                  <Globe className="h-5 w-5 mr-3 text-sizu-red mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium text-gray-600">Implementer's Website</span>
                    <a 
                      href={metadata.implementersWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {metadata.implementersWebsite}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{project.brief}</p>
            
            {metadata.coreObjectives && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Core Objectives</h3>
                <p className="text-gray-700 whitespace-pre-line">{metadata.coreObjectives}</p>
              </div>
            )}
            
            {metadata.projectDetails && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Details</h3>
                <p className="text-gray-700 whitespace-pre-line">{metadata.projectDetails}</p>
              </div>
            )}
            
            {metadata.projectMilestones && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Milestones</h3>
                <p className="text-gray-700 whitespace-pre-line">{metadata.projectMilestones}</p>
              </div>
            )}
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Implementing Organization</h3>
              <div className="flex items-center text-gray-800">
                <Building className="h-5 w-5 mr-2 text-sizu-red" />
                {project.organization_id ? (
                  <Link 
                    to={`/organizations/${project.organization_id}`}
                    className="text-sizu-red hover:text-red-700 transition-colors"
                  >
                    {project.organization}
                  </Link>
                ) : (
                  <span>{project.organization}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
