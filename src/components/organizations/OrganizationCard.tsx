
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Globe, ArrowRight, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface OrganizationCardProps {
  id: string;
  organization_name: string;
  organization_brief: string;
  organization_type: string;
  phone: string;
  address: string;
  website: string | null;
  logo_url: string | null;
  projectsCount: number;
  source: 'profile' | 'organization';
  created_at?: string;
}

const OrganizationCard: React.FC<OrganizationCardProps> = (props) => {
  const [imgError, setImgError] = useState(false);

  const initials = props.organization_name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  const logoUrl = props.logo_url && props.logo_url.trim() !== "" ? props.logo_url : null;
  const showImage = logoUrl && !imgError;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 rounded-full mr-4 flex-shrink-0 overflow-hidden">
            {showImage ? (
              <img
                src={logoUrl}
                alt={props.organization_name}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-sizu-red/90 to-sizu-red text-white text-xl font-semibold">
                {initials}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {props.organization_name}
            </h3>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {props.organization_type}
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">
          {props.organization_brief}
        </p>
        
        <div className="space-y-2 mb-4 mt-auto">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-sizu-red" />
            <span className="line-clamp-1">{props.address}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-sizu-yellow" />
            <span>{props.projectsCount} {props.projectsCount === 1 ? 'Project' : 'Projects'}</span>
          </div>
          
          {props.website && (
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="h-4 w-4 mr-2 text-sizu-black" />
              <a 
                href={props.website.startsWith('http') ? props.website : `https://${props.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sizu-red hover:text-red-700 hover:underline"
              >
                Website
              </a>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 mt-auto">
        <Link
          to={`/organizations/${props.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 font-medium text-white bg-sizu-red hover:bg-red-700 transition-all duration-300 rounded-md shadow-md hover:shadow-lg"
        >
          View Organization <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OrganizationCard;

