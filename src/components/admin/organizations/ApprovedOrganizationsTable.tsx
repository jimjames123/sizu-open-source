import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInDays, isPast } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 8;

interface ApprovedOrganization {
  id: string;
  name: string;
  organization_type: string;
  is_paid: boolean;
  created_at: string;
  subscriptions: {
    end_date: string;
  }[];
}

export const ApprovedOrganizationsTable = () => {
  const [organizations, setOrganizations] = useState<ApprovedOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchApprovedOrganizations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select(`
          id, 
          name, 
          organization_type, 
          is_paid, 
          created_at,
          subscriptions!inner(
            id,
            is_active,
            end_date
          )
        `)
        .eq("subscriptions.is_active", true)
        .order("end_date", { ascending: true, referencedTable: "subscriptions" });

      if (error) throw error;

      setOrganizations(data || []);
    } catch (error: any) {
      console.error("Error fetching approved organizations:", error);
      toast({
        title: "Error loading organizations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrganizations();
  }, []);

  const totalPages = Math.max(1, Math.ceil(organizations.length / PAGE_SIZE));
  const paginatedOrgs = organizations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { text: "No expiry", variant: "secondary" as const };
    
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = differenceInDays(expiry, new Date());
    
    if (isPast(expiry)) {
      return { text: "Expired", variant: "destructive" as const };
    } else if (daysUntilExpiry <= 30) {
      return { text: `${daysUntilExpiry} days left`, variant: "outline" as const };
    } else {
      return { text: `${daysUntilExpiry} days left`, variant: "default" as const };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Approved Organizations</h3>
        <Badge variant="secondary">
          {organizations.length} organization{organizations.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrgs.map((org) => {
              const subscriptionEndDate = org.subscriptions[0]?.end_date;
              const expiryStatus = getExpiryStatus(subscriptionEndDate);
              
              return (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="capitalize">{org.organization_type}</TableCell>
                  <TableCell>
                    {format(new Date(org.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {subscriptionEndDate 
                      ? format(new Date(subscriptionEndDate), "MMM dd, yyyy")
                      : "No expiry"
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={expiryStatus.variant}>
                      {expiryStatus.text}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {organizations.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No approved organizations found
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, organizations.length)} of {organizations.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};