
import React from "react";
import { AlertCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";

interface SubscriptionNoticeProps {
  userId: string;
  onShowPaymentDialog: () => void;
}

const SubscriptionNotice: React.FC<SubscriptionNoticeProps> = ({
  userId,
  onShowPaymentDialog,
}) => {
  const navigate = useNavigate();

  // Hook expects userId now!
  const {
    canCreate,
    isLoading,
  } = useProjectPermissions(userId);

  // Only check isLoading and canCreate
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sizu-red"></div>
          </div>
        </div>
      </div>
    );
  }

  // Only show notice if user isn't allowed to create and userId is present
  if (canCreate === false && userId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">You've reached your free project limit</h3>
                <p className="mb-4">
                  You've used your 1 free starter project. To add more projects and unlock the full SIZU experience, your organization needs an active subscription.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-gray-900 mb-2">Subscription Details:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• One-time fee: UGX 45,000</li>
                  <li>• Upload unlimited projects</li>
                  <li>• Access to all platform features</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => {
                    if (onShowPaymentDialog) {
                      onShowPaymentDialog();
                    } else {
                      navigate('/payment');
                    }
                  }}
                  className="bg-sizu-red hover:bg-red-700 text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Status:</strong> No active subscription
                </p>
                {/* If you ever fetch organization name, you could display it here. */}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If the user can create, do not show anything.
  return null;
};

export default SubscriptionNotice;
