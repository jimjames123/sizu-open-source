
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectFormValues } from "@/components/projects/ProjectForm";

export const useProjectSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const handleSubmit = async (data: ProjectFormValues, userId: string | null, canCreate: boolean | null) => {
    // Guard against double submissions (StrictMode, rapid clicks, etc.)
    if (submittingRef.current) {
      console.log("Submission already in progress, ignoring duplicate call");
      return { error: new Error("Already submitting") };
    }

    try {
      // Double check payment status before submitting
      if (userId && canCreate === false) {
        return { showPaymentDialog: true };
      }

      submittingRef.current = true;
      setIsSubmitting(true);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error("Not authenticated");
      
      const targetGroups = data.targetGroups
        .split(",")
        .map(group => group.trim())
        .filter(group => group !== "");
      
      const metadata = {
        coreObjectives: data.coreObjectives || "",
        projectMilestones: data.projectMilestones || "",
        projectDetails: data.projectDetails || "",
        region: data.region || "",
        district: data.district || "",
        parish: data.parish || "",
        projectImplementer: data.projectImplementer || "",
        projectTeamLead: data.projectTeamLead || "",
        implementersWebsite: data.implementersWebsite || "",
        otherPartners: data.otherPartners || "",
        otherTargetGroup: data.otherTargetGroup || "",
        images: data.images || [],
        femtech: data.femtech === true,
        femtechFocus: data.femtech ? (data.femtechFocus || "") : "",
        femtechReviewStatus: data.femtech ? "provisional" : undefined,
      };
      
      const { data: newProject, error: insertError } = await supabase
        .from("projects")
        .insert({
          name: data.name,
          brief: data.brief,
          sector: data.sector,
          sdg: data.sdg,
          location: data.location,
          target_groups: targetGroups,
          start_date: format(data.startDate, "yyyy-MM-dd"),
          end_date: data.endDate ? format(data.endDate, "yyyy-MM-dd") : null,
          status: data.status,
          image: data.images && data.images.length > 0 ? data.images[0] : null,
          organization_id: userData.user.id,
          metadata: metadata
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setProjectId(newProject.id);
      setShowSuccess(true);

      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      });

      return { success: true };
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast({
        title: "Error adding project",
        description: error.message || "Could not add the project",
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  };

  return {
    isSubmitting,
    showSuccess,
    setShowSuccess,
    projectId,
    handleSubmit
  };
};
