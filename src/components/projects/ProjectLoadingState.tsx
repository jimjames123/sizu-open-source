
import React from "react";

const ProjectLoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md flex justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-sizu-red border-gray-200 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading project details...</p>
      </div>
    </div>
  );
};

export default ProjectLoadingState;
