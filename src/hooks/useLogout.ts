
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      
      // Clean up all auth-related storage before logout
      cleanupAuthState();
      
      // Force clear all auth state
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }
      
      console.log("Successfully logged out");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Redirect to landing page with a full page refresh for clean state
      window.location.href = "/";
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: error.message || "Could not log out",
        variant: "destructive"
      });
    }
  };
  
  // Helper function to clean up all auth-related storage
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  return { handleLogout, cleanupAuthState };
};

export default useLogout;
