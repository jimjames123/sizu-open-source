
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSubmitPaymentRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitPaymentRequest = async (
    referenceCode: string,
    paymentProofUrl: string | null
  ) => {
    try {
      setIsSubmitting(true);

      // Ensure we have authentication
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error("Authentication error. Please log in again.");
      }

      const userId = userData.user.id;
      
      // Step 1: Get the user's organization ID from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        throw new Error("Failed to access your profile. Please try logging out and back in.");
      }

      if (!profileData) {
        throw new Error("Your profile was not found. Please complete your registration first.");
      }

      if (!profileData.organization_id) {
        throw new Error("Your organization is not set up yet. Please complete your profile setup first.");
      }

      const organizationId = profileData.organization_id;
      
      // Step 2: Create a subscription entry (inactive until approved)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
      
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert({
          organization_id: organizationId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          payment_reference: referenceCode,
          payment_proof_url: paymentProofUrl,
          is_active: false
        })
        .select()
        .single();

      if (subscriptionError) {
        console.error("Subscription creation error:", subscriptionError);
        throw subscriptionError;
      }

      // Step 3: Create payment request entry for admin approval
      const { error: paymentRequestError } = await supabase
        .from("payment_requests")
        .insert({
          org_id: organizationId,
          submitted_by: userId,
          reference_code: referenceCode,
          payment_proof_url: paymentProofUrl
        });

      if (paymentRequestError) {
        console.error("Payment request submission error:", paymentRequestError);
        throw paymentRequestError;
      }

      toast({
        title: "Payment request submitted",
        description: "Your payment request has been submitted for approval. You'll be notified once approved."
      });

      return true;
    } catch (error: any) {
      console.error("Error submitting payment request:", error);
      toast({
        title: "Error submitting payment request",
        description: error.message || "Could not submit payment request",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitPaymentRequest };
};
