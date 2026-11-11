
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminUsersManagement from "@/components/admin/AdminUsersManagement";

const AdminSettings = () => {
  return (
    <AdminLayout
      title="Admin Settings"
      description="Manage administrator accounts and system settings"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage administrator accounts and system settings
          </p>
        </div>
        
        <AdminUsersManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
