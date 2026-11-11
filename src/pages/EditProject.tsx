
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProjectForm from "@/components/projects/ProjectForm";
import { useProjectData } from "@/hooks/useProjectData";
import ProjectLoadingState from "@/components/projects/ProjectLoadingState";
import ProjectUpdateHandler from "@/components/projects/ProjectUpdateHandler";

const EditProject: React.FC = () => {
  const { id } = useParams();
  const { isLoading, projectData } = useProjectData({ projectId: id });

  // Add console log to debug status value
  React.useEffect(() => {
    if (projectData) {
      console.log("Project data loaded with status:", projectData.status);
    }
  }, [projectData]);

  return (
    <DashboardLayout
      title="Edit Project"
      description="Update the details of your project"
      backLink={{
        url: "/dashboard/projects",
        label: "Back to Projects"
      }}
    >
      {isLoading ? (
        <ProjectLoadingState />
      ) : projectData ? (
        <ProjectUpdateHandler projectId={id!}>
          {({ onSubmit, isSubmitting }) => (
            <ProjectForm 
              defaultValues={projectData}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              cancelRoute="/dashboard/projects"
              submitButtonText="Update Project"
            />
          )}
        </ProjectUpdateHandler>
      ) : null}
    </DashboardLayout>
  );
};

export default EditProject;
