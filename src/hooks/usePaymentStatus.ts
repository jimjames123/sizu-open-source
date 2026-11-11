
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionStatus } from "./useSubscriptionStatus";

export const usePaymentStatus = (userId: string | null) => {
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasActiveSubscription, subscriptionData, isLoading: subscriptionLoading } = useSubscriptionStatus(userId);
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setIsLoading(true);
        
        console.log("💳 Starting payment status check for userId:", userId);
        
        // Get the current user if no userId was provided
        let authUserId = userId;
        if (!authUserId) {
          const { data: authData, error: authError } = await supabase.auth.getUser();
          if (authError || !authData.user) {
            console.error("❌ Auth error:", authError);
            setHasPendingRequest(false);
            setIsLoading(false);
            return;
          }
          authUserId = authData.user.id;
        }
        
        // Step 1: Get the user's organization ID from profiles
        console.log("🔍 Fetching profile for user:", authUserId);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", authUserId)
          .single();
        
        if (profileError || !profileData?.organization_id) {
          console.error("❌ Error finding organization:", profileError);
          console.log("📋 Profile data:", profileData);
          setHasPendingRequest(false);
          setIsLoading(false);
          return;
        }
        
        const orgId = profileData.organization_id;
        console.log("✅ Found organization ID:", orgId);
        
        // Step 2: Check if the organization has a pending payment request
        console.log("🔍 Checking payment requests for org:", orgId);
        const { data: paymentData, error: paymentError } = await supabase
          .from("payment_requests")
          .select("approved")
          .eq("org_id", orgId)
          .eq("approved", false)
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (paymentError) {
          console.error("❌ Error fetching payment requests:", paymentError);
          setHasPendingRequest(false);
        } else {
          const hasPending = paymentData && paymentData.length > 0;
          setHasPendingRequest(hasPending);
          console.log("📋 Payment request check result:", {
            orgId,
            paymentRequestsFound: paymentData?.length || 0,
            hasPendingRequest: hasPending
          });
        }
        
        // Debug logging
        console.log("💳 Final payment status:", {
          orgId,
          hasActiveSubscription,
          hasPendingRequest: paymentData && paymentData.length > 0,
          subscriptionData: subscriptionData ? "Found" : "None"
        });
      } catch (error) {
        console.error("❌ Error in checkPaymentStatus:", error);
        setHasPendingRequest(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only check payment status if subscription status is loaded
    if (!subscriptionLoading) {
      checkPaymentStatus();
    }
  }, [userId, hasActiveSubscription, subscriptionLoading]);
  
  // Calculate if subscription is expired
  const isExpired = hasActiveSubscription === false && subscriptionData !== null;
  
  return { 
    isPaid: hasActiveSubscription,
    hasPendingRequest, 
    isExpired,
    expiryDate: subscriptionData?.end_date ? new Date(subscriptionData.end_date) : null,
    isLoading: isLoading || subscriptionLoading
  };
};
