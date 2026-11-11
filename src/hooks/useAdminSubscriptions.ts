
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SubscriptionRequest {
  id: string;
  organization_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  payment_reference: string;
  payment_proof_url: string | null;
  approved_by: string | null;
  created_at: string;
  organization_name: string;
}

export const useAdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all subscription requests with organization names
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          organizations!organization_id(name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Format the data to include organization name
      const formattedData = data.map(subscription => ({
        ...subscription,
        organization_name: subscription.organizations?.name || "Unknown Organization"
      }));
      
      setSubscriptions(formattedData);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error loading subscriptions",
        description: error.message || "Could not load subscription requests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveSubscription = async (subscriptionId: string) => {
    try {
      // Get current user email for approval tracking
      const { data: userData } = await supabase.auth.getUser();
      const approverEmail = userData.user?.email || "admin";

      // First, get the subscription details to find the organization
      const { data: subscriptionData, error: fetchError } = await supabase
        .from("subscriptions")
        .select("organization_id, end_date")
        .eq("id", subscriptionId)
        .single();

      if (fetchError) throw fetchError;

      // Update the subscription to active
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ 
          is_active: true,
          approved_by: approverEmail
        })
        .eq("id", subscriptionId);
      
      if (updateError) throw updateError;

      // Update the organization's paid status and subscription expiry
      const { error: orgUpdateError } = await supabase
        .from("organizations")
        .update({ 
          is_paid: true,
          subscription_expires_at: subscriptionData.end_date
        })
        .eq("id", subscriptionData.organization_id);

      if (orgUpdateError) throw orgUpdateError;
      
      toast({
        title: "Subscription approved",
        description: "The organization's subscription has been activated successfully"
      });
      
      // Refresh the list
      await fetchSubscriptions();
    } catch (error: any) {
      console.error("Error approving subscription:", error);
      toast({
        title: "Error approving subscription",
        description: error.message || "Could not approve subscription",
        variant: "destructive"
      });
    }
  };

  const rejectSubscription = async (subscriptionId: string) => {
    try {
      // Delete the subscription request
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", subscriptionId);
      
      if (error) throw error;
      
      toast({
        title: "Subscription rejected",
        description: "Subscription request has been rejected and removed"
      });
      
      // Refresh the list
      await fetchSubscriptions();
    } catch (error: any) {
      console.error("Error rejecting subscription:", error);
      toast({
        title: "Error rejecting subscription",
        description: error.message || "Could not reject subscription",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    isLoading,
    approveSubscription,
    rejectSubscription,
    refresh: fetchSubscriptions
  };
};
