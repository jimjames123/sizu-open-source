
import React from "react";
import { Building2 } from "lucide-react";

interface OrganizationsEmptyStateProps {
  searchTerm: string;
}

const OrganizationsEmptyState = ({ searchTerm }: OrganizationsEmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No organizations found</h3>
      <p className="text-gray-600">
        {searchTerm ? "No organizations match your search criteria." : "There are no organizations registered yet."}
      </p>
    </div>
  );
};

export default OrganizationsEmptyState;
