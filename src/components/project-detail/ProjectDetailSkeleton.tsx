
import React from "react";

const ProjectDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;
