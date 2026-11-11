
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isUserAdmin } from "@/utils/adminUtils";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // First useEffect: Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log("No active session found");
          setIsAdmin(false);
          return;
        }
        
        // Check if user is admin
        const adminStatus = await isUserAdmin();
        console.log("Admin status check result:", adminStatus);
        setIsAdmin(adminStatus);
      } catch (error: any) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  // Second useEffect: Handle toast notifications based on admin status
  useEffect(() => {
    // Show authentication error toast if there was an error
    if (isAdmin === false && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive"
      });
    }
  }, [isAdmin, isLoading, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if admin
  return <>{children}</>;
};

export default AdminRoute;
