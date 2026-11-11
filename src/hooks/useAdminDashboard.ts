
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardStats {
  organizations: number;
  projects: number;
  events: number;
}

export const useAdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats>({
    organizations: 0,
    projects: 0,
    events: 0
  });
  const [recentOrganizations, setRecentOrganizations] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Get organizations count
      const { count: orgCount, error: orgError } = await supabase
        .from("profiles")
        .select("*", { count: "exact" });
        
      if (orgError) throw orgError;
      
      // Get projects count
      const { count: projectCount, error: projectError } = await supabase
        .from("projects")
        .select("*", { count: "exact" });
        
      if (projectError) throw projectError;
      
      // Get events count
      const { count: eventCount, error: eventError } = await supabase
        .from("events")
        .select("*", { count: "exact" });
        
      if (eventError) throw eventError;
      
      setStats({
        organizations: orgCount || 0,
        projects: projectCount || 0,
        events: eventCount || 0
      });

      // Fetch recent organizations
      const { data: recentOrgsData, error: recentOrgsError } = await supabase
        .from("profiles")
        .select("id, organization_name, organization_type, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentOrgsError) throw recentOrgsError;
      setRecentOrganizations(recentOrgsData || []);

      // Fetch recent projects
      const { data: recentProjectsData, error: recentProjectsError } = await supabase
        .from("projects")
        .select(`
          id, name, status, location, created_at,
          profiles:organization_id(organization_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentProjectsError) throw recentProjectsError;
      setRecentProjects(recentProjectsData || []);

      // Fetch upcoming events
      const { data: recentEventsData, error: recentEventsError } = await supabase
        .from("events")
        .select("id, title, event_date, location")
        .order("event_date", { ascending: true })
        .gte("event_date", new Date().toISOString())
        .limit(3);

      if (recentEventsError) throw recentEventsError;
      setRecentEvents(recentEventsData || []);
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      toast({
        title: "Error loading statistics",
        description: error.message || "Could not load admin dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
    
    // Set up real-time subscription for relevant events
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          console.log('New organization created');
          toast({
            title: "New Organization",
            description: "A new organization has been registered",
          });
          fetchStats();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'projects' 
        }, 
        () => {
          console.log('New project created');
          toast({
            title: "New Project",
            description: "A new project has been created",
          });
          fetchStats();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    isLoading,
    stats,
    recentOrganizations,
    recentProjects,
    recentEvents,
    refreshData: fetchStats
  };
};
