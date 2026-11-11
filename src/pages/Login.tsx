
import React, { useState, useEffect } from "react";
import SEO from "@/components/seo/SEO";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";
import useLoginRedirect from "@/hooks/useLoginRedirect";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";

const Login = () => {
  // Use the modified custom hook for login redirection logic
  useLoginRedirect();
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const { toast } = useToast();
  const { handleLogout } = useLogout();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        setHasExistingSession(!!data.session);
        console.log("Login page session check:", data.session ? "Session exists" : "No session");
      } catch (err) {
        console.error("Error in session check:", err);
        setHasExistingSession(false);
      }
    };
    
    checkSession();
  }, []);

  return (
    <>
      <SEO title="Login | SIZU" description="Sign in to your SIZU account to manage your organization profile and impact projects." path="/login" />
      <Navbar />
      <main className="page-container flex items-center justify-center min-h-[calc(100vh-240px)]">
        <div className="w-full max-w-md">
          <LoginHeader />

          {hasExistingSession && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-center">
              <p className="text-amber-800 mb-2">You already have an active session</p>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 inline-flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out first
              </Button>
            </div>
          )}

          <div className="glass-panel rounded-xl p-8">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
