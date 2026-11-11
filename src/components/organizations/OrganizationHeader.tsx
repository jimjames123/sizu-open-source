
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import { OrganizationDetailProps } from "@/hooks/useOrganizationData";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OrganizationHeaderProps {
  organization: OrganizationDetailProps;
  getInitials: (name: string) => string;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({ 
  organization,
  getInitials
}) => {
  return (
    <>
      <div className="mb-6">
        <Link
          to="/organizations"
          className="inline-flex items-center text-sizu-black hover:text-sizu-red transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Organizations
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 p-6 flex justify-center md:justify-start">
            <div className="h-32 w-32 rounded-xl overflow-hidden bg-gray-100">
              {organization.logo_url ? (
                <AspectRatio ratio={1/1} className="h-full w-full">
                  <img 
                    src={organization.logo_url} 
                    alt={organization.name}
                    className="h-full w-full object-cover" 
                  />
                </AspectRatio>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-sizu-red/90 to-sizu-red flex items-center justify-center text-white text-3xl font-bold">
                  {getInitials(organization.name)}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 md:p-8 md:pl-0 flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{organization.name}</h1>
                <p className="text-gray-500 mb-4">{organization.organization_type}</p>
              </div>
              
              {organization.website && (
                <a
                  href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 md:mt-0 inline-flex items-center text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-sizu-red transition-colors"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationHeader;
