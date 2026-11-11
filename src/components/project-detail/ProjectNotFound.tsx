
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProjectNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center text-sizu-black hover:text-sizu-red transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectNotFound;
