
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { SubscriptionRequest } from "@/hooks/useAdminSubscriptions";

interface SubscriptionsTableProps {
  subscriptions: SubscriptionRequest[];
  onApprove: (subscriptionId: string) => void;
  onReject: (subscriptionId: string) => void;
}

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  subscriptions,
  onApprove,
  onReject
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No subscription requests found.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Reference</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Payment Proof</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                {subscription.organization_name}
              </TableCell>
              <TableCell>
                <Badge variant={subscription.is_active ? "default" : "secondary"}>
                  {subscription.is_active ? "Active" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {subscription.payment_reference}
              </TableCell>
              <TableCell>
                {format(new Date(subscription.start_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(subscription.end_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(subscription.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {subscription.payment_proof_url ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(subscription.payment_proof_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                ) : (
                  <span className="text-gray-400">No proof</span>
                )}
              </TableCell>
              <TableCell>
                {!subscription.is_active && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApprove(subscription.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(subscription.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {subscription.is_active && (
                  <Badge variant="outline" className="text-green-600">
                    Approved by {subscription.approved_by}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriptionsTable;
