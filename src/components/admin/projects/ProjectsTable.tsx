
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tag,
  Building2,
  MapPin,
  EyeIcon,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface ProjectsTableProps {
  projects: any[];
  onDeleteProject: (id: string) => void;
}

const PAGE_SIZE = 10;

const ProjectsTable = ({ projects, onDeleteProject }: ProjectsTableProps) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [projects.length]);

  const handleEditProject = (projectId: string) => {
    navigate(`/dashboard/projects/edit/${projectId}`);
  };

  const visible = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 text-sm text-gray-600">
        <span>
          Showing <span className="font-medium text-gray-900">{visible.length}</span> of{" "}
          <span className="font-medium text-gray-900">{projects.length}</span> projects
        </span>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="font-medium">{project.name}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Tag className="h-3 w-3 mr-1" />
                    {project.sector}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-1" />
                    {project.organization_name}
                  </div>
                </TableCell>
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
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    {project.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Start:</span>
                      {format(new Date(project.start_date), "MMM dd, yyyy")}
                    </div>
                    {project.end_date && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">End:</span>
                        {format(new Date(project.end_date), "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="View project"
                    >
                      <EyeIcon className="h-4 w-4 text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleEditProject(project.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Edit project"
                    >
                      <Edit className="h-4 w-4 text-amber-600" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(hasMore || projects.length > PAGE_SIZE) && (
        <div className="flex justify-center gap-2 pt-2">
          {hasMore && (
            <Button
              variant="outline"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Show more ({projects.length - visibleCount} remaining)
            </Button>
          )}
          {projects.length > PAGE_SIZE && visibleCount > PAGE_SIZE && (
            <Button
              variant="ghost"
              onClick={() => {
                setVisibleCount(PAGE_SIZE);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Show less
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
