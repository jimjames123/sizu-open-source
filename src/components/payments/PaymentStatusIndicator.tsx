
import React from "react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { CheckCircle, AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface PaymentStatusIndicatorProps {
  userId: string;
  className?: string;
}

const PaymentStatusIndicator: React.FC<PaymentStatusIndicatorProps> = ({ userId, className }) => {
  const { isPaid, hasPendingRequest, isExpired, expiryDate, isLoading } = usePaymentStatus(userId);
  
  // Debug logging
  console.log("PaymentStatusIndicator:", { isPaid, hasPendingRequest, isExpired, expiryDate });
  
  if (isLoading) {
    return <div className={`text-gray-500 text-sm flex items-center ${className}`}>
      <span className="animate-pulse">Checking payment status...</span>
    </div>;
  }
  
  if (isPaid) {
    return (
      <div className={`text-green-600 text-sm flex items-center ${className}`}>
        <CheckCircle className="h-4 w-4 mr-1" />
        <span>
          Account Active
          {expiryDate && (
            <span className="ml-1 text-xs text-gray-500">
              (expires: {format(expiryDate, "MMM d, yyyy")})
            </span>
          )}
        </span>
      </div>
    );
  }
  
  if (isExpired) {
    return (
      <div className={`text-orange-600 text-sm flex items-center ${className}`}>
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span>Subscription Expired - Please Renew</span>
      </div>
    );
  }
  
  if (hasPendingRequest) {
    return (
      <div className={`text-amber-600 text-sm flex items-center ${className}`}>
        <Clock className="h-4 w-4 mr-1" />
        <span>Payment Pending Approval</span>
      </div>
    );
  }
  
  return (
    <div className={`text-red-600 text-sm flex items-center ${className}`}>
      <AlertCircle className="h-4 w-4 mr-1" />
      <span>Subscribe to start</span>
    </div>
  );
};

export default PaymentStatusIndicator;
