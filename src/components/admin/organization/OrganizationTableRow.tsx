
import React from "react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  EyeIcon,
  FileText,
  Globe,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Organization {
  id: string;
  organization_name: string;
  organization_type: string;
  email: string;
  phone: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  projectCount: number;
}

interface OrganizationTableRowProps {
  organization: Organization;
  onDeleteClick: (id: string) => void;
}

const OrganizationTableRow = ({
  organization: org,
  onDeleteClick,
}: OrganizationTableRowProps) => {
  // Get initials for placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 rounded-full">
            {org.logo_url ? (
              <AvatarImage
                src={org.logo_url}
                alt={org.organization_name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-sizu-red/90 to-sizu-red text-gray-100">
                {getInitials(org.organization_name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{org.organization_name}</div>
            {org.website && (
              <a
                href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 flex items-center hover:underline"
              >
                <Globe className="h-3 w-3 mr-1" />
                Website
              </a>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{org.organization_type}</Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-xs flex items-center">
            <Mail className="h-3 w-3 text-gray-400 mr-1" />
            {org.email}
          </div>
          <div className="text-xs flex items-center">
            <Phone className="h-3 w-3 text-gray-400 mr-1" />
            {org.phone}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-gray-400 mr-1" />
          {org.projectCount}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-xs flex items-center">
          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
          {format(new Date(org.created_at), "MMM dd, yyyy")}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Link
            to={`/organizations/${org.id}`}
            className="p-1 rounded-full hover:bg-gray-100"
            title="View organization"
          >
            <EyeIcon className="h-4 w-4 text-blue-600" />
          </Link>
          <button
            onClick={() => onDeleteClick(org.id)}
            className="p-1 rounded-full hover:bg-gray-100"
            title="Delete organization"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OrganizationTableRow;
