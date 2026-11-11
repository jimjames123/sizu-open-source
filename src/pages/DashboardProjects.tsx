import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FileEdit,
  Trash2,
  Eye,
  Search,
  AlertTriangle,
  Image,
  Lock,
} from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { getIconContainerClasses, getIconClasses } from "@/lib/form-utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import PaymentInstructionsDialog from "@/components/payments/PaymentInstructionsDialog";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";

type Project = Tables<"projects">;

const DashboardProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgName, setOrgName] = useState<string>("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { canCreate, projectCount, isFreeProject, freeLimit } = useUserPaymentStatus();
  const reachedFreeLimit = canCreate === false;

  useEffect(() => {
    const fetchProjectsAndProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("User not found");
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("organization_name")
          .eq("id", userData.user.id)
          .single();
          
        if (!profileError && profileData) {
          setOrgName(profileData.organization_name);
        }
        
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("organization_id", userData.user.id)
          .order("created_at", { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setProjects(data || []);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error loading projects",
          description: error.message || "Could not load your projects",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectsAndProfile();
  }, [toast]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);
        
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== projectId));
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description: error.message || "Could not delete the project",
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout
      title="My Projects"
      description="Manage your organization's projects"
    >
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-medium text-gray-700">{orgName || "Your Organization"}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} total
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
          {(isFreeProject || reachedFreeLimit) && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
              Free plan: {Math.min(projectCount, freeLimit)}/{freeLimit} projects used
              {reachedFreeLimit && " — Upgrade for unlimited"}
            </span>
          )}
          {reachedFreeLimit ? (
            <Button
              onClick={() => setShowPaymentDialog(true)}
              className="bg-sizu-red text-white flex items-center gap-2 px-4 py-2 rounded-md font-medium hover:bg-sizu-crimson hover:shadow-lg"
            >
              <Lock className="h-4 w-4" />
              Upgrade to Add More
            </Button>
          ) : (
            <Link
              to="/dashboard/projects/add"
              className="bg-sizu-red text-white flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:bg-sizu-crimson hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add New Project
            </Link>
          )}
        </div>
      </div>
      
      <div className="mb-8 space-y-4">
        <div className="search-container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className={getIconContainerClasses('left')}>
                <Search className={getIconClasses()} />
              </div>
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setStatusFilter("all")} 
            className={`filter-button ${statusFilter === "all" ? "active" : ""}`}
          >
            All Projects
          </button>
          <button 
            onClick={() => setStatusFilter("active")} 
            className={`filter-button ${statusFilter === "active" ? "active" : ""}`}
          >
            Active
          </button>
          <button 
            onClick={() => setStatusFilter("completed")} 
            className={`filter-button ${statusFilter === "completed" ? "active" : ""}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setStatusFilter("planning")} 
            className={`filter-button ${statusFilter === "planning" ? "active" : ""}`}
          >
            Planning
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const initials = project.name
              .split(' ')
              .slice(0, 2)
              .map(word => word.charAt(0))
              .join('')
              .toUpperCase();
              
            return (
              <Card key={project.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gray-200 relative">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-sizu-red/90 to-sizu-red text-white">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold mb-1">{initials}</div>
                        <Image className="h-6 w-6 opacity-50" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
                      ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1 mb-2">{project.name}</h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {project.brief}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="font-medium mr-2">Location:</span> {project.location}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="font-medium mr-2">Sector:</span> {project.sector}
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 p-3 flex justify-between">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-sizu-red hover:text-red-700 text-sm flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  
                  <div className="flex space-x-3">
                    <Link
                      to={`/dashboard/projects/edit/${project.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <FileEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-600 hover:text-red-800 text-sm flex items-center">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the project "{project.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          {projects.length === 0 ? (
            <>
              <AlertTriangle className="h-12 w-12 text-sizu-yellow mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any projects to showcase your work
              </p>
              <Link to="/dashboard/projects/add" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Link>
            </>
          ) : (
            <>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No matching projects</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }} 
                className="text-sizu-red hover:underline font-medium"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}

      <PaymentInstructionsDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      />
    </DashboardLayout>
  );
};

export default DashboardProjects;
