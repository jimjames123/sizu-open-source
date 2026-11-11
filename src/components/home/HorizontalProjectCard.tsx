import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image, MapPin, Tag, Target } from "lucide-react";
import { ProjectProps } from "./ProjectCard";

const statusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
  on_hold: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatStatus = (status: string): string =>
  status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getStatusColorClass = (status: string): string => {
  const normalized = status.replace(/-/g, "_").replace(/\s+/g, "_");
  return statusColors[normalized] || "bg-gray-100 text-gray-800";
};

const HorizontalProjectCard = ({ project }: { project: ProjectProps }) => {
  const initials = project.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex bg-white rounded-xl border border-gray-200/70 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-28 sm:w-40 md:w-44 flex-shrink-0 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sizu-crimson via-red-700 to-sizu-red text-white">
            <span className="text-2xl font-bold">{initials}</span>
            <Image className="h-5 w-5 opacity-50 mt-1" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
            {project.name}
          </h3>
          <span
            className={`hidden sm:inline-block flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusColorClass(
              project.status
            )}`}
          >
            {formatStatus(project.status)}
          </span>
        </div>

        {project.organization && (
          <p className="text-xs text-gray-500 truncate mb-2">{project.organization}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-2">
          <span className="inline-flex items-center min-w-0">
            <MapPin className="h-3.5 w-3.5 mr-1 text-sizu-red flex-shrink-0" />
            <span className="truncate max-w-[110px]">{project.location}</span>
          </span>
          <span className="inline-flex items-center min-w-0">
            <Tag className="h-3.5 w-3.5 mr-1 text-sizu-yellow flex-shrink-0" />
            <span className="truncate max-w-[110px]">{project.sector}</span>
          </span>
          <span className="hidden sm:inline-flex items-center min-w-0">
            <Target className="h-3.5 w-3.5 mr-1 text-sizu-black flex-shrink-0" />
            <span className="truncate max-w-[130px]">{project.sdg}</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{project.brief}</p>

        <span className="mt-auto pt-3 inline-flex items-center text-xs sm:text-sm font-medium text-sizu-red">
          View Project
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

export default HorizontalProjectCard;
