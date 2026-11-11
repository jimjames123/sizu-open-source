
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import OrganizationTableRow from "./OrganizationTableRow";
import OrganizationDeleteDialog from "./OrganizationDeleteDialog";
import { supabase } from "@/integrations/supabase/client";
import { asSupabaseParam } from "@/utils/supabaseUtils";

interface Organization {
  id: string;
  organization_name: string;
  organization_type: string;
  email: string;
  phone: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  projectCount: number;
}

interface OrganizationsTableProps {
  organizations: Organization[];
}

const OrganizationsTable = ({ organizations }: OrganizationsTableProps) => {
  const { toast } = useToast();
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);
  const [updatedOrganizations, setUpdatedOrganizations] = useState<Organization[]>(organizations);
  
  // Update local state when props change
  React.useEffect(() => {
    setUpdatedOrganizations(organizations);
  }, [organizations]);
  
  const handleDeleteConfirm = async () => {
    if (!orgToDelete) return;
    
    try {
      let isDeleted = false;
      
      // First try to delete from profiles table
      let { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", asSupabaseParam(orgToDelete));
        
      if (error) {
        console.error("Error deleting organization from profiles:", error);
        // Try organizations table instead
        const { error: orgError } = await supabase
          .from("organizations")
          .delete()
          .eq("id", asSupabaseParam(orgToDelete));
          
        if (orgError) {
          console.error("Error deleting from organizations table:", orgError);
          throw orgError;
        } else {
          isDeleted = true;
        }
      } else {
        isDeleted = true;
      }
      
      if (isDeleted) {
        // Update local state
        const filtered = updatedOrganizations.filter(org => org.id !== orgToDelete);
        setUpdatedOrganizations(filtered);
        
        toast({
          title: "Organization deleted",
          description: "The organization has been successfully removed",
        });
      }
    } catch (error: any) {
      console.error("Error deleting organization:", error);
      toast({
        title: "Error deleting organization",
        description: error.message || "Could not delete the organization",
        variant: "destructive"
      });
    } finally {
      setOrgToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updatedOrganizations.map((org) => (
              <OrganizationTableRow 
                key={org.id}
                organization={org}
                onDeleteClick={(id) => setOrgToDelete(id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <OrganizationDeleteDialog
        isOpen={!!orgToDelete}
        onClose={() => setOrgToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default OrganizationsTable;
