
import React from "react";
import { MapPin, CheckCircle, Users } from "lucide-react";
import { OrganizationDetailProps } from "@/hooks/useOrganizationData";

interface OrganizationInfoProps {
  organization: OrganizationDetailProps;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({ organization }) => {
  return (
    <div className="border-t border-gray-200 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Organization</h2>
          <p className="text-gray-700 whitespace-pre-line">{organization.description}</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-sizu-red mt-0.5" />
              <div>
                <span className="block text-sm font-medium text-gray-600">Address</span>
                <span className="block text-gray-900">{organization.address}</span>
              </div>
            </div>
            
            {organization.phone && (
              <div className="flex items-start">
                <div className="h-5 w-5 mr-3 flex items-center justify-center text-sizu-red mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-600">Phone</span>
                  <span className="block text-gray-900">{organization.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Stats</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Active Projects</span>
                <p className="text-xl font-semibold">{organization.activeProjectsCount}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Organization Type</span>
                <p className="text-xl font-semibold">{organization.organization_type}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
