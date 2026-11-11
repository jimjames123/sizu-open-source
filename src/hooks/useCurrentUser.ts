
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCurrentUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        const currentUserId = data.user?.id || null;
        setUserId(currentUserId);
      } catch (error: any) {
        console.error("Error fetching current user:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "Could not verify your login status",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, [toast]);

  return { userId, isLoading };
};
