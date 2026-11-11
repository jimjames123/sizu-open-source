
import React from "react";
import { FileText } from "lucide-react";

interface ProjectsEmptyStateProps {
  searchTerm?: string;
}

const ProjectsEmptyState = ({ searchTerm }: ProjectsEmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No projects found</h3>
      <p className="text-gray-600">
        {searchTerm ? "No projects match your search criteria." : "There are no projects added yet."}
      </p>
    </div>
  );
};

export default ProjectsEmptyState;
