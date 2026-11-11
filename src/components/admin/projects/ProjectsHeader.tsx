
import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";

interface ProjectsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProjectsHeader = ({ searchTerm, onSearchChange }: ProjectsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-auto flex-1">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search projects by name, organization, location or status..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={() => navigate("/dashboard/projects/add")}
        className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
};

export default ProjectsHeader;
