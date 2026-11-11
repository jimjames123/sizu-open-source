
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getNextPath } from "@/lib/authRedirect";

export const useLoginRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Only check for session once on login page load
    // Don't set up any automatic redirects for future sessions
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        console.log("Checking session on login page:", data.session ? "Session exists" : "No session");
        
        if (data.session) {
          console.log("Active session found, redirecting to dashboard");
          // Use window.location.href for a full page refresh to ensure clean state
          window.location.href = getNextPath();
        }
      } catch (err) {
        console.error("Error in session check:", err);
      }
    };
    
    checkSession();
    
  }, [navigate]);
};

export default useLoginRedirect;
