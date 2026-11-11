import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ApprovedOrganizationsTable } from "@/components/admin/organizations/ApprovedOrganizationsTable";

const AdminApprovedOrganizations = () => {
  return (
    <AdminLayout
      title="Approved Organizations"
      description="View and manage all approved organizations with active subscriptions"
    >
      <div className="space-y-6">
        <ApprovedOrganizationsTable />
      </div>
    </AdminLayout>
  );
};

export default AdminApprovedOrganizations;