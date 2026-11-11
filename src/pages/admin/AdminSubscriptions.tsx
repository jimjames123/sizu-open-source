
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SubscriptionsTable from "@/components/admin/subscriptions/SubscriptionsTable";
import { useAdminSubscriptions } from "@/hooks/useAdminSubscriptions";

const AdminSubscriptions = () => {
  const {
    subscriptions,
    isLoading,
    approveSubscription,
    rejectSubscription
  } = useAdminSubscriptions();
  
  return (
    <AdminLayout
      title="Subscription Management"
      description="Review and manage organization subscription requests"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Subscription Requests</h2>
          <p className="text-gray-500">
            Review subscription requests from organizations and manage their access
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <SubscriptionsTable 
            subscriptions={subscriptions}
            onApprove={approveSubscription}
            onReject={rejectSubscription}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
