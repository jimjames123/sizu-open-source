
import React from "react";
import { format } from "date-fns";
import { CheckCircle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentRequest } from "@/hooks/usePaymentRequests";

interface PaymentRequestsTableProps {
  paymentRequests: PaymentRequest[];
  onApprove: (requestId: string, orgId: string) => void;
  onReject: (requestId: string) => void;
}

const PaymentRequestsTable: React.FC<PaymentRequestsTableProps> = ({
  paymentRequests,
  onApprove,
  onReject
}) => {
  if (paymentRequests.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No pending payment requests</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Organization</TableHead>
              <TableHead className="w-[150px]">Reference Code</TableHead>
              <TableHead className="w-[120px]">Submitted</TableHead>
              <TableHead className="w-[120px]">Payment Proof</TableHead>
              <TableHead className="w-[200px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentRequests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="max-w-[180px] truncate">
                    {request.organization_name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[130px] truncate text-sm">
                    {request.reference_code}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {format(new Date(request.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  {request.payment_proof_url ? (
                    <a 
                      href={request.payment_proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">No proof</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => onApprove(request.id, request.org_id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onReject(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentRequestsTable;
