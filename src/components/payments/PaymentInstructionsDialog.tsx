
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Clock } from "lucide-react";
import PaymentMethodTabs from "./PaymentMethodTabs";
import PaymentForm from "./PaymentForm";
import { useSubmitPaymentRequest } from "@/hooks/useSubmitPaymentRequest";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

interface PaymentInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentInstructionsDialog: React.FC<PaymentInstructionsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [referenceCode, setReferenceCode] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const { isSubmitting, submitPaymentRequest } = useSubmitPaymentRequest();
  const { hasPendingRequest, isLoading: isStatusLoading } = usePaymentStatus(null);

  const handleSubmit = async () => {
    if (!referenceCode.trim()) {
      toast({
        title: "Reference code required",
        description: "Please enter a payment reference code",
        variant: "destructive"
      });
      return;
    }

    try {
      // Call the submitPaymentRequest function with the reference code and payment proof URL
      const success = await submitPaymentRequest(referenceCode, paymentProofUrl);
      
      if (success) {
        // Close the dialog and redirect to dashboard
        onOpenChange(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Toast notification is already shown in the submitPaymentRequest function
    }
  };

  const handleFileUpload = (url: string | null) => {
    setPaymentProofUrl(url);
  };

  // If a payment request is already pending, show the pending status UI
  if (hasPendingRequest) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            <DialogTitle>Payment Request Pending</DialogTitle>
            <DialogDescription>
              Your payment request has already been submitted and is pending approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 flex flex-col items-center justify-center text-amber-600 space-y-4">
            <Clock className="h-12 w-12" />
            <p className="text-center">
              We're currently reviewing your payment request. Once approved, you'll be able to add projects.
              Please check back later or contact support if you have any questions.
            </p>
          </div>
          
          <DialogFooter className="pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Loading state
  if (isStatusLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <div className="my-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p>Checking payment status...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle>Subscribe to start</DialogTitle>
          <DialogDescription>
            Before adding projects, your organization needs to make a subscription fee of UGX 45,000 or USD 15 for a full year access.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <PaymentMethodTabs />
          <PaymentForm 
            referenceCode={referenceCode}
            setReferenceCode={setReferenceCode}
            onFileUpload={handleFileUpload}
          />
        </div>
        
        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !referenceCode.trim()}
            className="bg-sizu-red hover:bg-sizu-crimson text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Payment Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentInstructionsDialog;
