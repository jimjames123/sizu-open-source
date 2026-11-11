
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define proper types for the payment request with nested data
export interface PaymentRequest {
  id: string;
  org_id: string;
  reference_code: string;
  payment_proof_url: string | null;
  created_at: string;
  approved: boolean;
  organization_name: string; // For the formatted data
}

export const usePaymentRequests = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaymentRequests = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all pending payment requests
      // Use the explicit hint syntax for the foreign key relationship
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*, organizations!org_id(name)")
        .eq("approved", false)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Format the data to include organization name
      const formattedData = data.map(request => ({
        ...request,
        organization_name: request.organizations?.name || "Unknown Organization"
      }));
      
      setPaymentRequests(formattedData);
    } catch (error: any) {
      console.error("Error fetching payment requests:", error);
      toast({
        title: "Error loading payment requests",
        description: error.message || "Could not load payment requests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approvePayment = async (requestId: string, orgId: string) => {
    try {
      // First approve the payment request
      const { error: updateError } = await supabase
        .from("payment_requests")
        .update({ approved: true })
        .eq("id", requestId);
      
      if (updateError) throw updateError;
      
      // The subscription_expires_at will be automatically set by the database trigger
      // We just need to update is_paid status which is also done by the trigger
      // But let's fetch the updated organization to get the expiry date for toast message
      const { data: orgData, error: orgFetchError } = await supabase
        .from("organizations")
        .select("subscription_expires_at")
        .eq("id", orgId)
        .single();
      
      if (orgFetchError) throw orgFetchError;
      
      // Format the expiry date for the toast message
      const expiryDate = new Date(orgData.subscription_expires_at);
      const formattedDate = expiryDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      toast({
        title: "Payment approved",
        description: `Payment has been approved and organization subscription is active until ${formattedDate}`
      });
      
      // Refresh the list
      await fetchPaymentRequests();
    } catch (error: any) {
      console.error("Error approving payment:", error);
      toast({
        title: "Error approving payment",
        description: error.message || "Could not approve payment",
        variant: "destructive"
      });
    }
  };

  const rejectPayment = async (requestId: string) => {
    try {
      // Delete the payment request
      const { error } = await supabase
        .from("payment_requests")
        .delete()
        .eq("id", requestId);
      
      if (error) throw error;
      
      toast({
        title: "Payment rejected",
        description: "Payment request has been rejected and removed"
      });
      
      // Refresh the list
      await fetchPaymentRequests();
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Error rejecting payment",
        description: error.message || "Could not reject payment",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  return {
    paymentRequests,
    isLoading,
    approvePayment,
    rejectPayment,
    refresh: fetchPaymentRequests
  };
};
