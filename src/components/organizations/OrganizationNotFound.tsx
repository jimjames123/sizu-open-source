
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building } from "lucide-react";

const OrganizationNotFound = () => {
  return (
    <div className="bg-gray-50 pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Link
            to="/organizations"
            className="inline-flex items-center text-sizu-black hover:text-sizu-red transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Organizations
          </Link>
          
          <div className="text-center py-6">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Organization Not Found</h1>
            <p className="text-gray-600 mb-6">
              The organization you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationNotFound;
