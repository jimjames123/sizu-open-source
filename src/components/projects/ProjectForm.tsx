
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { ProjectFormProvider, useProjectFormContext } from "./context/ProjectFormContext";
import FormTabs from "./navigation/FormTabs";
import FormNavigation from "./navigation/FormNavigation";
import { projectFormSchema, ProjectFormValues } from "./schema/projectFormSchema";

export type { ProjectFormValues } from "./schema/projectFormSchema";
export { projectFormSchema, sectorOptions, statusOptions, sdgOptions } from "./schema/projectFormSchema";

export interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
  cancelRoute: string;
  submitButtonText: string;
}

// Inner component that has access to the context
const ProjectFormInner: React.FC<ProjectFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  cancelRoute = "/dashboard/projects",
  submitButtonText = "Save Project"
}) => {
  const { activeTab, goToNextTab } = useProjectFormContext();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      brief: "",
      sector: "",
      femtech: false,
      femtechFocus: "",
      sdg: "",
      location: "",
      targetGroups: "",
      status: "planning",
      images: [],
      coreObjectives: "",
      projectMilestones: "",
      projectDetails: "",
      region: "",
      district: "",
      parish: "",
      projectImplementer: "",
      projectTeamLead: "",
      implementersWebsite: "",
      otherPartners: "",
      otherTargetGroup: "",
      ...defaultValues,
    },
  });
  
  const handleSubmit = async (values: ProjectFormValues) => {
    await onSubmit(values);
  };

  const handleSaveAndNext = async () => {
    // Validate only the current tab fields
    let fieldsToValidate: (keyof ProjectFormValues)[] = [];
    
    if (activeTab === 'basic') {
      fieldsToValidate = ['name', 'brief', 'sector', 'sdg', 'location', 'startDate', 'status'];
    } else if (activeTab === 'details') {
      fieldsToValidate = ['targetGroups', 'coreObjectives', 'projectMilestones'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;
    
    // Navigate to next tab
    goToNextTab();
  };
  
  return (
    <div className="bg-white rounded-xl p-8 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormTabs form={form} />
          <FormNavigation 
            onSaveAndNext={handleSaveAndNext}
            isSubmitting={isSubmitting}
            cancelRoute={cancelRoute}
            submitButtonText={submitButtonText}
          />
        </form>
      </Form>
    </div>
  );
};

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  return (
    <ProjectFormProvider>
      <ProjectFormInner {...props} />
    </ProjectFormProvider>
  );
};

export default ProjectForm;
