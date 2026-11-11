
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Tag, Target, ArrowRight, Image } from "lucide-react";

export interface ProjectProps {
  id: string;
  name: string;
  organization: string;
  organization_id?: string; 
  location: string;
  sector: string;
  sdg: string;
  targetGroups: string[];
  status: string;
  startDate: string;
  endDate?: string;
  image: string;
  brief: string;
}

// Consistent status color mapping
const statusColors = {
  "planning": "bg-blue-100 text-blue-800",
  "active": "bg-green-100 text-green-800",
  "completed": "bg-purple-100 text-purple-800",
  "on_hold": "bg-amber-100 text-amber-800",
  "cancelled": "bg-red-100 text-red-800",
};

const ProjectCard = ({ project }: { project: ProjectProps }) => {
  // Get first two letters from project name for placeholder
  const initials = project.name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  // Format status for display with proper formatting
  const formatStatus = (status: string): string => {
    console.log("Formatting status in card:", status);
    
    // Replace underscores with spaces and capitalize
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get the right CSS class for the status badge
  const getStatusColorClass = (status: string): string => {
    // Normalize status value to match keys in statusColors
    const normalizedStatus = status.replace(/-/g, '_').replace(/\s+/g, '_');
    return statusColors[normalizedStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col min-h-[320px] md:min-h-[380px] group">
      <div className="relative h-36 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sizu-crimson via-red-700 to-sizu-red text-white">
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold mb-2">{initials}</div>
              <Image className="h-8 w-8 opacity-50" />
            </div>
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColorClass(project.status)}`}>
            {formatStatus(project.status)}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {project.name}
        </h3>
        
        {project.organization && (
          <p className="text-sm text-gray-500 mb-1">
            {project.organization}
          </p>
        )}
        
        <div className="my-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-sizu-red" />
            <span>{project.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="h-4 w-4 mr-2 text-sizu-yellow" />
            <span>{project.sector}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2 text-sizu-black" />
            <span className="line-clamp-1">{project.sdg}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-sizu-red" />
            <span>
              {new Date(project.startDate).toLocaleDateString()} 
              {project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString()}` : ""}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {project.brief}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1 mb-4">
            {project.targetGroups.slice(0, 3).map((group, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {group}
              </span>
            ))}
            {project.targetGroups.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                +{project.targetGroups.length - 3}
              </span>
            )}
          </div>
          
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 font-medium text-white bg-sizu-red hover:bg-red-700 transition-all duration-300 rounded-md shadow-md hover:shadow-lg"
          >
            View Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
