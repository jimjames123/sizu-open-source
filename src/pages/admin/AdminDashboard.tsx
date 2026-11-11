
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCards from "@/components/admin/dashboard/StatCards";
import RecentOrganizations from "@/components/admin/dashboard/RecentOrganizations";
import RecentProjects from "@/components/admin/dashboard/RecentProjects";
import UpcomingEvents from "@/components/admin/dashboard/UpcomingEvents";
import DashboardLoader from "@/components/admin/dashboard/DashboardLoader";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

const AdminDashboard = () => {
  const {
    isLoading,
    stats,
    recentOrganizations,
    recentProjects,
    recentEvents
  } = useAdminDashboard();

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Overview of the platform and management tools"
    >
      {isLoading ? (
        <DashboardLoader />
      ) : (
        <>
          <StatCards stats={stats} isLoading={isLoading} />
          <RecentOrganizations organizations={recentOrganizations} />
          <RecentProjects projects={recentProjects} />
          <UpcomingEvents events={recentEvents} />
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
