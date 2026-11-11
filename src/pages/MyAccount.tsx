
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, Globe, MapPin, Calendar, Shield, ArrowRight, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout";

type Profile = Tables<"profiles">;

const MyAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [joined, setJoined] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const { handleLogout } = useLogout();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          navigate("/login");
          return;
        }
        
        // Store the user's email
        setUserEmail(userData.user.email || "");
        
        // Format join date
        const joinDate = new Date(userData.user.created_at);
        setJoined(joinDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }));
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        setProfile(profileData);
      } catch (error: any) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading account information",
          description: error.message || "Could not load your profile",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate, toast]);

  const navigateToProfile = () => {
    navigate("/dashboard/profile");
  };

  const navigateToProjects = () => {
    navigate("/dashboard/projects");
  };

  return (
    <>
      <Navbar />
      <main className="page-container bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <DashboardSidebar />
            
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Account</h1>
                
                {/* Account Dropdown Menu - FIXED IMPLEMENTATION */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Account Options
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border z-50">
                    <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={navigateToProjects} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Projects
                    </DropdownMenuItem>
                    <Separator className="my-1" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sizu-red"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile Overview Card */}
                  <Card>
                    <CardHeader className="bg-gradient-to-br from-sizu-red/10 to-sizu-red/5 border-b">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Building className="h-6 w-6" />
                        Organization Profile
                      </CardTitle>
                      <CardDescription>
                        View and manage your organization profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {profile?.logo_url ? (
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-md overflow-hidden border">
                              <img 
                                src={profile.logo_url} 
                                alt={profile.organization_name || "Organization logo"} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h2 className="font-bold text-xl">
                                {profile.organization_name}
                              </h2>
                              <p className="text-gray-500 text-sm">
                                {profile.organization_type}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-md overflow-hidden border bg-gray-100 flex items-center justify-center">
                              <Building className="h-10 w-10 text-gray-400" />
                            </div>
                            <div>
                              <h2 className="font-bold text-xl">
                                {profile?.organization_name || "Organization Name"}
                              </h2>
                              <p className="text-gray-500 text-sm">
                                {profile?.organization_type || "Organization Type"}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-sizu-red mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Email Address</p>
                              <p className="text-gray-500">{userEmail || "Not provided"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-sizu-red mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Phone Number</p>
                              <p className="text-gray-500">{profile?.phone || "Not provided"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-sizu-red mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Address</p>
                              <p className="text-gray-500">{profile?.address || "Not provided"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-sizu-red mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Website</p>
                              <p className="text-gray-500">{profile?.website || "Not provided"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-sizu-red mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Joined SIZU</p>
                              <p className="text-gray-500">{joined}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-sizu-red mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Account Type</p>
                              <p className="text-gray-500">Organization Account</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 mt-4 border-t flex justify-end">
                          <Button 
                            variant="default" 
                            onClick={() => navigate("/dashboard/profile")}
                            className="bg-sizu-red hover:bg-sizu-crimson text-white"
                          >
                            Edit Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Organization Brief */}
                  {profile?.organization_brief && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">About Organization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          {profile.organization_brief}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Account Actions Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Account Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className="justify-start h-auto py-3"
                          onClick={() => navigate("/dashboard/projects")}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Manage Projects</span>
                            <span className="text-xs text-gray-500">View and edit your projects</span>
                          </div>
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="justify-start h-auto py-3"
                          onClick={() => navigate("/dashboard/projects/add")}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Add New Project</span>
                            <span className="text-xs text-gray-500">Create a new project</span>
                          </div>
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="justify-start h-auto py-3"
                          onClick={() => navigate("/dashboard/profile")}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Edit Profile</span>
                            <span className="text-xs text-gray-500">Update your organization details</span>
                          </div>
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="justify-start h-auto py-3"
                          onClick={async () => {
                            await supabase.auth.signOut();
                            navigate("/login");
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Sign Out</span>
                            <span className="text-xs text-gray-500">Log out of your account</span>
                          </div>
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyAccount;
