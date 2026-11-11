
import React, { useState, useEffect } from "react";
import SEO from "@/components/seo/SEO";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import RegisterForm from "../components/register/RegisterForm";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";

const Register = () => {
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasExistingSession(!!data.session);
    };
    
    checkSession();
  }, []);

  return (
    <>
      <SEO title="Register Your Organization | SIZU" description="Join SIZU to showcase your impact projects, reach partners and funders, and contribute to sustainable development in Uganda." path="/register" />
      <Navbar />
      <main className="page-container">
        <section className="max-w-4xl mx-auto">
          <h1 className="section-heading text-4xl md:text-5xl font-bold mb-6 mt-6">
            Ready to start your SIZU journey?
          </h1>
          
          {hasExistingSession && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-8">
              <h3 className="font-medium text-amber-800 mb-2">You're already logged in</h3>
              <p className="text-amber-700 text-sm mb-4">
                You need to log out before you can register a new organization.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 inline-flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out first
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Go to dashboard
                </Button>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-8">
            <h3 className="font-medium text-blue-800 mb-2">Registration Information</h3>
            <p className="text-blue-700 text-sm mb-2">
              To use SIZU, you must register your organization. This single registration process creates both your user account and organization profile.
            </p>
            <ul className="list-disc ml-5 text-blue-700 text-sm mb-4">
              <li>Your organization will be listed in our organizations directory</li>
              <li>You'll be able to upload and showcase your projects</li>
              <li>Connect with other organizations and potential partners</li>
            </ul>
          </div>

          <div className="glass-panel rounded-xl p-8">
            {!hasExistingSession && <RegisterForm />}
            {hasExistingSession && (
              <div className="text-center p-8">
                <p className="text-gray-600 mb-4">Please log out first to register a new organization</p>
                <Button onClick={handleLogout} variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

export default Register;
