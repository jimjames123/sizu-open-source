
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionStatus = (userId: string | null) => {
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        setIsLoading(true);
        
        console.log("🔍 Starting subscription check for userId:", userId);
        
        // Get the current user if no userId was provided
        let authUserId = userId;
        if (!authUserId) {
          const { data: authData, error: authError } = await supabase.auth.getUser();
          if (authError || !authData.user) {
            console.error("❌ Auth error:", authError);
            setHasActiveSubscription(false);
            setIsLoading(false);
            return;
          }
          authUserId = authData.user.id;
          console.log("✅ Got auth user ID:", authUserId);
        }
        
        // Get the user's organization ID from profiles
        console.log("🔍 Fetching profile for user:", authUserId);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", authUserId)
          .single();
        
        if (profileError || !profileData?.organization_id) {
          console.error("❌ Error finding organization:", profileError);
          console.log("📋 Profile data:", profileData);
          setHasActiveSubscription(false);
          setIsLoading(false);
          return;
        }
        
        const orgId = profileData.organization_id;
        console.log("✅ Found organization ID:", orgId);
        
        // Check for active subscription
        console.log("🔍 Checking subscriptions for org:", orgId);
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("organization_id", orgId)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (subscriptionError) {
          console.error("❌ Error fetching subscription data:", subscriptionError);
          setHasActiveSubscription(false);
          setIsLoading(false);
          return;
        }
        
        console.log("📋 Raw subscription query result:", subscriptionData);
        
        if (subscriptionData && subscriptionData.length > 0) {
          const subscription = subscriptionData[0];
          console.log("📋 Found subscription:", subscription);
          
          // Check if subscription is still valid (not expired)
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
          
          const endDate = new Date(subscription.end_date);
          endDate.setHours(23, 59, 59, 999); // Set to end of day for comparison
          
          console.log("📅 Today (start of day):", today.toISOString());
          console.log("📅 Subscription end date (end of day):", endDate.toISOString());
          console.log("📅 Is subscription valid?", endDate >= today);
          
          if (endDate >= today) {
            console.log("✅ Subscription is active and valid");
            setHasActiveSubscription(true);
            setSubscriptionData(subscription);
          } else {
            console.log("⚠️ Subscription exists but is expired");
            setHasActiveSubscription(false);
            setSubscriptionData(subscription);
          }
        } else {
          console.log("❌ No active subscription found");
          setHasActiveSubscription(false);
          setSubscriptionData(null);
        }
        
        // Final debug logging
        console.log("🎯 Final subscription status:", {
          orgId,
          subscriptionCount: subscriptionData?.length || 0,
          hasActiveSubscription: subscriptionData && subscriptionData.length > 0 && 
            new Date(subscriptionData[0]?.end_date + 'T23:59:59.999Z') >= new Date()
        });
        
      } catch (error) {
        console.error("❌ Error in checkSubscriptionStatus:", error);
        setHasActiveSubscription(false);
        setSubscriptionData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSubscriptionStatus();
  }, [userId]);
  
  return { 
    hasActiveSubscription, 
    subscriptionData,
    isLoading 
  };
};
