
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleSupabaseResponse, asSupabaseParam } from "@/utils/supabaseUtils";

export const useAdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all projects with organization info
      const response = await supabase
        .from("projects")
        .select(`
          *,
          profiles!inner(organization_name)
        `)
        .order("created_at", { ascending: false });
      
      const data = handleSupabaseResponse(response);
      if (!data) {
        setProjects([]);
        setFilteredProjects([]);
        return;
      }
      
      // Transform the data to include organization name
      const transformedData = data.map(project => {
        // Handle missing profiles safely
        const organizationName = project.profiles && 
          project.profiles.organization_name ? 
          project.profiles.organization_name : "Unknown Organization";
        
        return {
          ...project,
          organization_name: organizationName
        };
      });
      
      setProjects(transformedData);
      setFilteredProjects(transformedData);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error loading projects",
        description: error.message || "Could not load project data",
        variant: "destructive"
      });
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", asSupabaseParam(projectToDelete));
        
      if (error) throw error;
      
      // Update the local state
      const updatedProjects = projects.filter(project => project.id !== projectToDelete);
      setProjects(updatedProjects);
      setFilteredProjects(
        filteredProjects.filter(project => project.id !== projectToDelete)
      );
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description: error.message || "Could not delete the project",
        variant: "destructive"
      });
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const closeDeleteDialog = () => {
    setProjectToDelete(null);
  };

  return {
    projects: filteredProjects,
    isLoading,
    searchTerm,
    projectToDelete,
    handleSearchChange,
    handleDeleteConfirm,
    openDeleteDialog,
    closeDeleteDialog
  };
};
