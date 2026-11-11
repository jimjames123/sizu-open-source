
import React from "react";
import { Link } from "react-router-dom";
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
import { MapPin, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  location: string;
  profiles?: {
    organization_name: string;
  };
}

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects = ({ projects }: RecentProjectsProps) => {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Projects</h2>
      <Card className="shadow-sm mb-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.profiles?.organization_name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge className={
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'on_hold' ? 'bg-orange-100 text-orange-800' :
                        project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {project.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t">
          <Link to="/admin/projects" className="text-blue-600 hover:underline flex items-center justify-end">
            View All Projects <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </Card>
    </>
  );
};

export default RecentProjects;
