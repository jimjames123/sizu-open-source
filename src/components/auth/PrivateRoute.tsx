
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    // Set up auth state listener FIRST
    const setupAuthListener = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state change in PrivateRoute:", event);
        setIsAuthenticated(!!session);
        setIsLoading(false);
        
        if (!session && event === 'SIGNED_OUT') {
          // Show toast only when explicitly signed out
          toast({
            title: "Authentication required",
            description: "Please log in to access this area",
            variant: "destructive",
          });
        }
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
        
        const hasSession = !!data.session;
        console.log("PrivateRoute session check:", hasSession ? "Authenticated" : "Not authenticated");
        
        if (!hasSession) {
          toast({
            title: "Authentication required",
            description: "Please log in to access this area",
            variant: "destructive",
          });
        }
        
        setIsAuthenticated(hasSession);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
        
        toast({
          title: "Authentication error",
          description: "Please try logging in again",
          variant: "destructive",
        });
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
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate 
      to="/login" 
      state={{ from: location.pathname }}
      replace 
    />
  );
};

export default PrivateRoute;
