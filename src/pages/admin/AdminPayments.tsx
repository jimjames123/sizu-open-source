
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PaymentRequestsTable from "@/components/admin/payments/PaymentRequestsTable";
import { usePaymentRequests } from "@/hooks/usePaymentRequests";

const AdminPayments = () => {
  const {
    paymentRequests,
    isLoading,
    approvePayment,
    rejectPayment
  } = usePaymentRequests();
  
  return (
    <AdminLayout
      title="Payment Requests"
      description="Review and manage payment requests from organizations"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Requests</h2>
          <p className="text-gray-600 mb-6">
            Review payment requests from organizations that want to register projects
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="w-full">
              <PaymentRequestsTable 
                paymentRequests={paymentRequests}
                onApprove={approvePayment}
                onReject={rejectPayment}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
