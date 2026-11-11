
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectProps } from "@/components/home/ProjectCard";
import { determineOrganizationName, normalizeStatus, debugOrganizationData } from "@/utils/organizationUtils";

export const useOrganizationProjects = (id: string | undefined, organizationName: string | undefined) => {
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrganizationProjects = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          console.log("No organization ID provided");
          setProjects([]);
          return;
        }
        
        console.log("Fetching projects for organization ID:", id);
        
        // Use a more efficient query with fewer columns
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select(`
            id, name, organization_id, location, sector, 
            sdg, target_groups, status, start_date, end_date, 
            image, brief,
            profiles:organization_id(organization_name)
          `)
          .eq("organization_id", id);
          
        if (projectsError) {
          console.error("Error fetching organization projects:", projectsError);
          toast({
            title: "Error",
            description: "Failed to load organization projects",
            variant: "destructive",
          });
          setProjects([]);
          return;
        }
        
        if (projectsData && projectsData.length > 0) {
          console.log("Found projects for organization:", projectsData.length);
          
          // Format and dedupe by name+start_date (safety net for accidental duplicate inserts)
          const seen = new Set<string>();
          const formattedProjects = projectsData
            .map(project => {
              const orgName = organizationName || determineOrganizationName(project) || "Unknown Organization";
              return {
                id: project.id,
                name: project.name || "Untitled Project",
                organization: orgName,
                organization_id: project.organization_id,
                location: project.location || "Unknown Location",
                sector: project.sector || "Unspecified Sector",
                sdg: project.sdg || "Unspecified SDG",
                targetGroups: project.target_groups || [],
                status: normalizeStatus(project.status || ""),
                startDate: project.start_date,
                endDate: project.end_date || undefined,
                image: project.image || "",
                brief: project.brief || "No description available"
              };
            })
            .filter(p => {
              const key = `${p.name.trim().toLowerCase()}|${p.startDate || ''}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          
          setProjects(formattedProjects);
        } else {
          console.log("No projects found for this organization ID:", id);
          setProjects([]);
        }
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load projects",
          variant: "destructive",
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrganizationProjects();
  }, [id, organizationName, toast]);

  return { projects, isLoading };
};
