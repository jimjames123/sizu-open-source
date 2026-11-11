
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Building2, Clock, ArrowRight } from "lucide-react";

interface Organization {
  id: string;
  organization_name: string;
  organization_type: string;
  created_at: string;
}

interface RecentOrganizationsProps {
  organizations: Organization[];
}

const RecentOrganizations = ({ organizations }: RecentOrganizationsProps) => {
  // Sort organizations by creation date (newest first)
  const sortedOrganizations = [...organizations].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Organizations</h2>
      <Card className="shadow-sm mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrganizations.length > 0 ? (
                sortedOrganizations.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-blue-600 mr-2" />
                        {org.organization_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.organization_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {format(new Date(org.created_at), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        to={`/organizations/${org.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No organizations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t">
          <Link to="/admin/organizations" className="text-blue-600 hover:underline flex items-center justify-end">
            View All Organizations <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </Card>
    </>
  );
};

export default RecentOrganizations;
