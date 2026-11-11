
import React from "react";

interface ProjectLoadingSpinnerProps {
  className?: string;
}

const ProjectLoadingSpinner: React.FC<ProjectLoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={`flex justify-center py-12 ${className || ""}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
    </div>
  );
};

export default ProjectLoadingSpinner;
