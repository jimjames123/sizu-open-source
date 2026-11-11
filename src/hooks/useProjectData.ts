
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ProjectFormValues } from "@/components/projects/schema/projectFormSchema";

interface UseProjectDataProps {
  projectId: string | undefined;
}

interface ProjectData {
  id: string;
  name: string;
  brief: string;
  sector: string;
  sdg: string;
  location: string;
  target_groups: string[];
  start_date: string;
  end_date: string | null;
  status: string;
  image: string | null;
  metadata?: {
    coreObjectives?: string;
    projectMilestones?: string;
    projectDetails?: string;
    region?: string;
    district?: string;
    parish?: string;
    projectImplementer?: string;
    projectTeamLead?: string;
    implementersWebsite?: string;
    otherPartners?: string;
    otherTargetGroup?: string;
    images?: string[];
  };
}

export const useProjectData = ({ projectId }: UseProjectDataProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectFormValues | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error("Project not found");
        }
        
        console.log("Fetched project data:", data);
        
        // Type-cast the data to include metadata
        const projectWithMetadata = data as unknown as ProjectData;
        
        // Extract metadata fields with proper fallbacks
        const metadata = projectWithMetadata.metadata || {};
        
        // Transform the data into form values
        const formValues: ProjectFormValues = {
          name: data.name,
          brief: data.brief,
          sector: data.sector,
          sdg: data.sdg,
          location: data.location,
          targetGroups: Array.isArray(data.target_groups) ? data.target_groups.join(", ") : "",
          startDate: parseISO(data.start_date),
          endDate: data.end_date ? parseISO(data.end_date) : undefined,
          status: data.status,
          images: metadata.images || (data.image ? [data.image] : []),
          // Extract metadata fields with fallbacks
          coreObjectives: metadata.coreObjectives || "",
          projectMilestones: metadata.projectMilestones || "",
          projectDetails: metadata.projectDetails || "",
          region: metadata.region || "",
          district: metadata.district || "",
          parish: metadata.parish || "",
          projectImplementer: metadata.projectImplementer || "",
          projectTeamLead: metadata.projectTeamLead || "",
          implementersWebsite: metadata.implementersWebsite || "",
          otherPartners: metadata.otherPartners || "",
          otherTargetGroup: metadata.otherTargetGroup || "",
        };
        
        console.log("Transformed form values:", formValues);
        setProjectData(formValues);
      } catch (error: any) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error loading project",
          description: error.message || "Failed to load project details",
          variant: "destructive",
        });
        navigate("/dashboard/projects");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (projectId) {
      fetchProject();
    }
  }, [projectId, navigate, toast]);

  return { isLoading, projectData };
};
