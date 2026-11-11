
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectsHeader from "@/components/admin/projects/ProjectsHeader";
import ProjectsTable from "@/components/admin/projects/ProjectsTable";
import ProjectsEmptyState from "@/components/admin/projects/ProjectsEmptyState";
import DeleteProjectDialog from "@/components/admin/projects/DeleteProjectDialog";
import DashboardLoader from "@/components/admin/dashboard/DashboardLoader";
import { useAdminProjects } from "@/hooks/useAdminProjects";

const AdminProjects = () => {
  const {
    projects,
    isLoading,
    searchTerm,
    projectToDelete,
    handleSearchChange,
    handleDeleteConfirm,
    openDeleteDialog,
    closeDeleteDialog
  } = useAdminProjects();

  return (
    <AdminLayout
      title="Projects Management"
      description="View and manage all projects on the platform"
    >
      <ProjectsHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      {isLoading ? (
        <DashboardLoader />
      ) : projects.length > 0 ? (
        <ProjectsTable 
          projects={projects}
          onDeleteProject={openDeleteDialog}
        />
      ) : (
        <ProjectsEmptyState searchTerm={searchTerm} />
      )}
      
      <DeleteProjectDialog
        isOpen={!!projectToDelete}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </AdminLayout>
  );
};

export default AdminProjects;
