
import { useState } from "react";
import { useToast } from "./use-toast";
import { getAllAdminUsers, registerAdminUser, removeAdminUser } from "@/utils/adminUtils";

export const useAdminUsers = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAdminUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAllAdminUsers();
      
      if (!result.success) {
        setError(result.error || "Could not fetch admin users");
        toast({
          title: "Error",
          description: result.error || "Could not fetch admin users",
          variant: "destructive"
        });
        return;
      }
      
      setAdmins(result.data || []);
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAdminUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await registerAdminUser(email, password);
      
      if (!result.success) {
        setError(result.error || "Could not add admin user");
        toast({
          title: "Error",
          description: result.error || "Could not add admin user",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: "Admin user added successfully",
      });
      
      // Refresh the list of admins
      await fetchAdminUsers();
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdminUser = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await removeAdminUser(email);
      
      if (!result.success) {
        setError(result.error || "Could not remove admin user");
        toast({
          title: "Error",
          description: result.error || "Could not remove admin user",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: "Admin user removed successfully",
      });
      
      // Refresh the list of admins
      await fetchAdminUsers();
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    admins,
    isLoading,
    error,
    fetchAdminUsers,
    addAdminUser,
    deleteAdminUser
  };
};

export default useAdminUsers;
