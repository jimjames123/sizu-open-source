
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { format } from "date-fns";
import { ProjectFormValues } from "@/components/projects/schema/projectFormSchema";
import { asSupabaseParam } from "@/utils/supabaseUtils";

interface ProjectUpdateHandlerProps {
  projectId: string;
  children: (props: {
    onSubmit: (values: ProjectFormValues) => Promise<void>;
    isSubmitting: boolean;
  }) => React.ReactNode;
}

const ProjectUpdateHandler: React.FC<ProjectUpdateHandlerProps> = ({ projectId, children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      
      const targetGroupsArray = values.targetGroups
        .split(',')
        .map(group => group.trim())
        .filter(group => group !== '');
        
      const metadata = {
        coreObjectives: values.coreObjectives,
        projectMilestones: values.projectMilestones,
        projectDetails: values.projectDetails,
        region: values.region,
        district: values.district,
        parish: values.parish,
        projectImplementer: values.projectImplementer,
        projectTeamLead: values.projectTeamLead,
        implementersWebsite: values.implementersWebsite,
        otherPartners: values.otherPartners,
        otherTargetGroup: values.otherTargetGroup,
        images: values.images || []
      };
      
      console.log("Submitting project update with status:", values.status);
      
      const allowedStatus = ["planning", "active", "completed", "on_hold", "cancelled"];
      
      if (!allowedStatus.includes(values.status)) {
        throw new Error(`Invalid status value: ${values.status}. Must be one of: ${allowedStatus.join(', ')}`);
      }
      
      const updateObject: any = {
        name: values.name,
        brief: values.brief,
        sector: values.sector,
        sdg: values.sdg,
        location: values.location,
        target_groups: targetGroupsArray,
        start_date: format(values.startDate, 'yyyy-MM-dd'),
        end_date: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : null,
        status: values.status,
        image: values.images && values.images.length > 0 ? values.images[0] : null,
        metadata: metadata,
        updated_at: new Date().toISOString()
      };
      
      console.log("Full update object:", updateObject);
      
      const { error, data } = await supabase
        .from("projects")
        .update(updateObject)
        .eq("id", asSupabaseParam(projectId));
        
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Update successful:", data);
      
      sonnerToast.success("Project updated successfully");
      
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Error updating project",
        description: error.message || "There was an error updating your project.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>{children({ onSubmit: handleSubmit, isSubmitting })}</>;
};

export default ProjectUpdateHandler;
