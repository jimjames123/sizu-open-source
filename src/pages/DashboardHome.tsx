
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Upload, 
  User, 
  Folder, 
  ArrowRight,
  Building,
  Calendar
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const DashboardHome = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error("User not found");
        }
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        // Get project count
        const { count, error: projectError } = await supabase
          .from("projects")
          .select("*", { count: "exact" })
          .eq("organization_id", userData.user.id);
          
        if (projectError) {
          throw projectError;
        }
        
        setProfile(profileData);
        setProjectCount(count || 0);
      } catch (error: any) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: error.message || "Could not load your profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileAndProjects();
  }, [toast]);

  return (
    <DashboardLayout
      title="Organization Project Panel"
      description="Manage your projects and organization information"
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
        </div>
      ) : (
        <>
          {/* Organization Profile Card */}
          <Card className="mb-8 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <Building className="mr-2 h-5 w-5 text-sizu-red" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {profile?.logo_url ? (
                      <img 
                        src={profile.logo_url} 
                        alt={profile.organization_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex-grow space-y-3">
                  <h3 className="text-2xl font-bold">{profile?.organization_name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{profile?.organization_type}</p>
                  <p className="text-gray-700">{profile?.organization_brief}</p>
                  
                  <Link 
                    to="/dashboard/profile" 
                    className="inline-flex items-center text-sizu-red hover:text-red-700 font-medium text-sm mt-4"
                  >
                    Edit Organization Profile
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Project Panel Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/dashboard/projects">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="h-12 w-12 rounded-full bg-sizu-red/10 flex items-center justify-center mb-4">
                      <Folder className="h-6 w-6 text-sizu-red" />
                    </div>
                    <h3 className="text-lg font-semibold">My Projects</h3>
                    <p className="text-3xl font-bold mt-2">{projectCount}</p>
                    <p className="text-gray-600 mt-1">Projects Uploaded</p>
                    <span className="mt-4 inline-flex items-center text-sizu-red font-medium">
                      View All Projects <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/dashboard/projects/add">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="h-12 w-12 rounded-full bg-sizu-yellow/10 flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-sizu-yellow" />
                    </div>
                    <h3 className="text-lg font-semibold">Add New Project</h3>
                    <p className="text-gray-600 mt-1">Upload details about your latest initiative</p>
                    <span className="mt-4 inline-flex items-center text-sizu-yellow font-medium">
                      Add Project <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/organizations">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Building className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Network</h3>
                    <p className="text-gray-600 mt-1">Connect with other organizations</p>
                    <span className="mt-4 inline-flex items-center text-gray-600 font-medium">
                      View Organizations <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardHome;
