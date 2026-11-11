
import { supabase } from "@/integrations/supabase/client";

export const deleteOrganization = async (orgId: string) => {
  try {
    // First try to delete from profiles table
    let { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", orgId);
      
    if (error) {
      console.error("Error deleting organization from profiles:", error);
      // Try organizations table instead
      const { error: orgError } = await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);
        
      if (orgError) throw orgError;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting organization:", error);
    throw error;
  }
};
