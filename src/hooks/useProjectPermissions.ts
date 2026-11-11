
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isUserAdmin } from "@/utils/adminUtils";
import { useSubscriptionStatus } from "./useSubscriptionStatus";

const FREE_PROJECT_LIMIT = 1;

export const useProjectPermissions = (userId: string | null) => {
  const [canCreate, setCanCreate] = useState<boolean | null>(null);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [isFreeProject, setIsFreeProject] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscriptionStatus(userId);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!userId) {
        setCanCreate(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const isAdmin = await isUserAdmin();

        // Count this org's existing projects
        const { count, error: countError } = await supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", userId);

        if (countError) {
          console.error("❌ Error counting projects:", countError);
        }

        const currentCount = count ?? 0;
        setProjectCount(currentCount);

        if (isAdmin) {
          setCanCreate(true);
          setIsFreeProject(false);
          setIsLoading(false);
          return;
        }

        if (subscriptionLoading) return;

        const hasSub = hasActiveSubscription === true;
        const withinFreeTier = currentCount < FREE_PROJECT_LIMIT;

        setIsFreeProject(!hasSub && withinFreeTier);
        setCanCreate(hasSub || withinFreeTier);

        console.log("🎯 Project permissions:", {
          userId,
          isAdmin,
          hasSub,
          projectCount: currentCount,
          withinFreeTier,
          canCreate: hasSub || withinFreeTier,
        });
      } catch (error) {
        console.error("❌ Error checking permissions:", error);
        setCanCreate(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [userId, hasActiveSubscription, subscriptionLoading]);

  return { canCreate, isLoading, projectCount, isFreeProject, freeLimit: FREE_PROJECT_LIMIT };
};
