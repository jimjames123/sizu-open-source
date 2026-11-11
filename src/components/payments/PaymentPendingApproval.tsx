
import React from "react";
import { Clock } from "lucide-react";

const PaymentPendingApproval: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex flex-col items-center space-y-4 max-w-xl mx-auto mt-8">
    <Clock className="h-10 w-10 text-amber-500 mb-2" />
    <h2 className="text-lg font-semibold text-yellow-900">Payment Pending Approval</h2>
    <p className="text-yellow-800 text-center">
      Your payment request has been submitted and is currently being reviewed by our team.
      <br />
      Once your payment is approved, you’ll be able to add and manage your projects.
      <br />
      Please check back soon or contact support if you have questions.
    </p>
  </div>
);

export default PaymentPendingApproval;
