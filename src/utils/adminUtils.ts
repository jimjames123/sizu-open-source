
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current authenticated user is an admin
 * This uses the admin_settings table to verify admin status
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    // Get current user's email
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      return false;
    }
    
    const userEmail = userData.user.email;
    
    if (!userEmail) {
      console.error("User has no email");
      return false;
    }
    
    console.log("Checking admin status for email:", userEmail);
    
    // Check if the user's email is in the admin_settings table using RPC
    const { data, error } = await supabase.rpc(
      'is_admin_by_email',
      { email: userEmail }
    );
    
    if (error) {
      console.error("Error checking admin status:", error);
      
      // Direct query as fallback (helpful for debugging)
      const { data: directData, error: directError } = await supabase
        .from('admin_settings')
        .select('admin_email')
        .eq('admin_email', userEmail);
      
      if (directError) {
        console.error("Direct admin check also failed:", directError);
      } else {
        console.log("Direct admin check result:", directData);
        return directData && directData.length > 0;
      }
      
      return false;
    }
    
    const isAdmin = data && data.length > 0 && data[0].count > 0;
    console.log("Admin status result:", isAdmin ? "Is admin" : "Not admin");
    
    return isAdmin;
  } catch (error) {
    console.error("Error in isUserAdmin:", error);
    return false;
  }
};

/**
 * Register a new admin user
 * This first creates a regular user account and then adds the admin role
 * Only existing admins can create new admin accounts
 */
export const registerAdminUser = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
  try {
    // First check if the current user is an admin (for authorization)
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      return { 
        success: false, 
        error: "Only existing administrators can register new admin accounts" 
      };
    }
    
    // First, check if the email is already registered as an admin
    const { data: existingAdmin } = await supabase
      .from('admin_settings')
      .select('admin_email')
      .eq('admin_email', email);
    
    if (existingAdmin && existingAdmin.length > 0) {
      return { 
        success: false, 
        error: "This email is already registered as an admin" 
      };
    }
    
    // Insert the new admin record
    const { error: insertError } = await supabase
      .from('admin_settings')
      .insert({ admin_email: email });
    
    if (insertError) {
      console.error("Error adding admin record:", insertError);
      return { 
        success: false, 
        error: `Failed to create admin account: ${insertError.message}` 
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in registerAdminUser:", error);
    return { 
      success: false, 
      error: `An unexpected error occurred: ${error.message}` 
    };
  }
};

/**
 * Remove admin privileges from a user
 * Only existing admins can remove admin privileges
 */
export const removeAdminUser = async (adminEmail: string): Promise<{success: boolean, error?: string}> => {
  try {
    // First check if the current user is an admin
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      return { 
        success: false, 
        error: "Only administrators can remove admin privileges" 
      };
    }
    
    // Get the current user's email to prevent self-removal
    const { data: userData } = await supabase.auth.getUser();
    const currentUserEmail = userData.user?.email;
    
    if (currentUserEmail === adminEmail) {
      return { 
        success: false, 
        error: "You cannot remove your own admin privileges" 
      };
    }
    
    // Remove the admin record
    const { error: deleteError } = await supabase
      .from('admin_settings')
      .delete()
      .eq('admin_email', adminEmail);
    
    if (deleteError) {
      console.error("Error removing admin record:", deleteError);
      return { 
        success: false, 
        error: `Failed to remove admin privileges: ${deleteError.message}` 
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in removeAdminUser:", error);
    return { 
      success: false, 
      error: `An unexpected error occurred: ${error.message}` 
    };
  }
};

/**
 * Get all admin users
 * Only accessible by admins
 */
export const getAllAdminUsers = async (): Promise<{success: boolean, data?: any[], error?: string}> => {
  try {
    // First check if the current user is an admin
    const isAdmin = await isUserAdmin();
    
    if (!isAdmin) {
      return { 
        success: false, 
        error: "Only administrators can view admin users" 
      };
    }
    
    const { data, error } = await supabase
      .from('admin_settings')
      .select('id, admin_email, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching admin users:", error);
      return { 
        success: false, 
        error: `Failed to fetch admin users: ${error.message}` 
      };
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in getAllAdminUsers:", error);
    return { 
      success: false, 
      error: `An unexpected error occurred: ${error.message}` 
    };
  }
};

/**
 * Utility to check if admin tables exist in the database
 * This helps diagnose if admin-related tables are causing conflicts
 */
export const checkAdminTablesExist = async (): Promise<{exists: boolean, tables: string[]}> => {
  try {
    // Check if admin-related tables exist using RPC
    const { data, error } = await supabase.rpc(
      'check_admin_tables_exist'
    );
      
    if (error) {
      console.error("Error checking admin tables:", error);
      return { exists: false, tables: [] };
    }
    
    const exists = data && data.length > 0 && data[0].count > 0;
    console.log("Admin tables exist:", exists ? "Yes" : "No");
    
    return { 
      exists, 
      tables: ["admin_settings"] 
    };
  } catch (error) {
    console.error("Error in checkAdminTablesExist:", error);
    return { exists: false, tables: [] };
  }
};

/**
 * Check if user has permission to create projects
 * Checks if the user is an admin or if the organization has paid
 */
export const canUserCreateProjects = async (userId: string): Promise<boolean> => {
  try {
    // Check if the user is an admin (admins can always create projects)
    const isAdmin = await isUserAdmin();
    if (isAdmin) {
      console.log("User is admin, can create projects");
      return true;
    }
    
    // Get the user's organization
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      return false;
    }
    
    // Check if the organization has paid using the can_create_projects RPC function
    const { data, error } = await supabase.rpc(
      'can_create_projects',
      { org_id: userId }  // Note: In this app, the user ID is the same as the organization ID
    );
    
    if (error) {
      console.error("Error checking project creation permission:", error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error("Error in canUserCreateProjects:", error);
    return false;
  }
};

/**
 * Diagnostic function to check all admin access components
 */
export const diagnosticAdminCheck = async (): Promise<{
  isAdmin: boolean,
  tablesExist: boolean,
  user: any,
  error?: string
}> => {
  try {
    // Get user details
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return {
        isAdmin: false,
        tablesExist: false,
        user: null,
        error: "Failed to get user: " + userError.message
      };
    }
    
    // Check if admin tables exist
    const { exists: tablesExist } = await checkAdminTablesExist();
    
    // Check admin status
    const adminStatus = await isUserAdmin();
    
    return {
      isAdmin: adminStatus,
      tablesExist,
      user: userData.user,
    };
  } catch (error: any) {
    console.error("Diagnostic admin check failed:", error);
    return {
      isAdmin: false,
      tablesExist: false,
      user: null,
      error: error.message || "Unknown error"
    };
  }
};
