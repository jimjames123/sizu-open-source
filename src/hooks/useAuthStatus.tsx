
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isUserAdmin } from "@/utils/adminUtils";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    // Set up auth state listener FIRST
    const setupAuthListener = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state change event:", event);
        const loggedIn = !!session;
        setIsLoggedIn(loggedIn);
        
        // Check if user is admin using the security definer function
        // This avoids direct auth.users access
        if (loggedIn && session) {
          // Defer admin check to prevent potential deadlocks
          setTimeout(async () => {
            try {
              const adminStatus = await isUserAdmin();
              setIsAdmin(adminStatus);
              console.log("Admin status check:", adminStatus ? "Is admin" : "Not admin");
            } catch (error) {
              console.error("Error checking admin status:", error);
              setIsAdmin(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      });
      
      authSubscription = subscription;
    };
    
    // THEN check for existing session
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        const loggedIn = !!data.session;
        console.log("Current session:", loggedIn ? "Logged in" : "Not logged in");
        setIsLoggedIn(loggedIn);
        
        // Check if user is admin without accessing auth.users
        if (loggedIn && data.session) {
          try {
            const adminStatus = await isUserAdmin();
            console.log("Admin status check:", adminStatus ? "Is admin" : "Not admin");
            setIsAdmin(adminStatus);
          } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };
    
    // Setup auth listener and check current auth status
    setupAuthListener();
    checkAuth();
    
    // Cleanup subscription on unmount
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);
  
  return { isLoggedIn, isAdmin, isLoading };
};

export default useAuthStatus;
