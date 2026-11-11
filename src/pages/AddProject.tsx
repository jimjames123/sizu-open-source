import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProjectForm, { ProjectFormValues } from "@/components/projects/ProjectForm";
import SuccessDialog from "@/components/projects/SuccessDialog";
import PaymentInstructionsDialog from "@/components/payments/PaymentInstructionsDialog";
import PaymentStatusIndicator from "@/components/payments/PaymentStatusIndicator";
import ProjectLoadingSpinner from "@/components/projects/ProjectLoadingSpinner";
import SubscriptionNotice from "@/components/projects/SubscriptionNotice";
import DuplicateCheckDialog, { DuplicateCandidate } from "@/components/projects/DuplicateCheckDialog";
import { Progress } from "@/components/ui/progress";
import { useProjectSubmission } from "@/hooks/useProjectSubmission";
import { useUserPaymentStatus } from "@/hooks/useUserPaymentStatus";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import PaymentPendingApproval from "@/components/payments/PaymentPendingApproval";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AddProject = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [candidates, setCandidates] = useState<DuplicateCandidate[]>([]);
  const [pendingData, setPendingData] = useState<ProjectFormValues | null>(null);

  const { userId, canCreate, isLoading, isFreeProject, projectCount, freeLimit } = useUserPaymentStatus();
  const {
    isSubmitting,
    showSuccess,
    setShowSuccess,
    projectId,
    handleSubmit,
  } = useProjectSubmission();

  const { hasPendingRequest, isLoading: isPaymentStatusLoading } = usePaymentStatus(userId);

  const runSubmission = async (data: ProjectFormValues) => {
    const result = await handleSubmit(data, userId, canCreate);
    if (result?.showPaymentDialog) {
      setShowPaymentDialog(true);
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    // Run the AI duplication precheck for every project, regardless of status.


    setPendingData(data);
    setCandidates([]);
    setShowDuplicateDialog(true);
    setIsChecking(true);

    try {
      const { data: res, error } = await supabase.functions.invoke("ai-insights", {
        body: {
          action: "precheck-duplicates",
          name: data.name,
          brief: data.brief,
          sector: data.sector,
          sdg: data.sdg,
          location: data.location,
          region: data.region,
        },
      });
      if (error) throw error;
      setCandidates(res?.candidates ?? []);
    } catch (e: any) {
      // If the check fails, don't block submission — show a notice and proceed.
      console.error("Duplicate precheck failed", e);
      toast.error("Duplicate check unavailable, continuing with submission.");
      setShowDuplicateDialog(false);
      await runSubmission(data);
      setPendingData(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleProceed = async () => {
    if (!pendingData) return;
    setShowDuplicateDialog(false);
    const data = pendingData;
    setPendingData(null);
    await runSubmission(data);
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateDialog(false);
    setPendingData(null);
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
  };

  if (isLoading || isPaymentStatusLoading) {
    return (
      <DashboardLayout
        title="Add New Project"
        description="Create a new project for your organization"
        backLink={{ url: "/dashboard/projects", label: "Back to Projects" }}
      >
        <ProjectLoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Add New Project"
      description="Create a new project for your organization"
      backLink={{ url: "/dashboard/projects", label: "Back to Projects" }}
    >
      {userId && <PaymentStatusIndicator userId={userId} className="mb-4" />}

      {canCreate === false && userId && hasPendingRequest ? (
        <PaymentPendingApproval />
      ) : canCreate === false && userId ? (
        <SubscriptionNotice
          userId={userId}
          onShowPaymentDialog={() => setShowPaymentDialog(true)}
        />
      ) : canCreate === true ? (
        <>
          {isFreeProject && (
            <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-sizu-red/5 to-sizu-yellow/5 border border-sizu-red/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-sizu-red mt-0.5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    This is your free starter project
                  </h3>
                  <p className="text-sm text-gray-600">
                    Showcase your work to demonstrate value. After publishing, additional projects require a subscription.
                  </p>
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>Free projects</span>
                      <span>{projectCount} / {freeLimit} used</span>
                    </div>
                    <Progress value={(projectCount / freeLimit) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <ProjectForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting || isChecking}
            cancelRoute="/dashboard/projects"
            submitButtonText="Create Project"
          />
          <SuccessDialog
            open={showSuccess}
            onOpenChange={setShowSuccess}
            projectId={projectId}
            onAddAnother={handleAddAnother}
            wasFreeProject={isFreeProject}
            onUpgrade={() => setShowPaymentDialog(true)}
          />
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-500">Loading user permissions...</p>
        </div>
      )}

      <PaymentInstructionsDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      />

      <DuplicateCheckDialog
        open={showDuplicateDialog}
        onOpenChange={(o) => { if (!o) handleCancelDuplicate(); }}
        isChecking={isChecking}
        candidates={candidates}
        onProceed={handleProceed}
        onCancel={handleCancelDuplicate}
      />
    </DashboardLayout>
  );
};

export default AddProject;
