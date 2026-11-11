
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FileUploader from "@/components/ui/FileUploader";

interface PaymentFormProps {
  referenceCode: string;
  setReferenceCode: (code: string) => void;
  onFileUpload: (url: string | null) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  referenceCode, 
  setReferenceCode, 
  onFileUpload 
}) => {
  // Enhanced file types for payment proofs
  const paymentProofTypes = [
    'image/jpeg', 
    'image/jpg',
    'image/png', 
    'image/gif', 
    'image/webp',
    'application/pdf',
    'image/bmp',
    'image/tiff'
  ];

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="reference-code" className="text-sm font-medium">Payment Reference Code <span className="text-red-500">*</span></Label>
        <Input 
          id="reference-code"
          placeholder="Enter the transaction reference code"
          value={referenceCode}
          onChange={(e) => setReferenceCode(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500">
          This is the reference code from your bank transfer or mobile money transaction
        </p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Payment Proof (Optional)</Label>
        <FileUploader 
          onUpload={onFileUpload} 
          maxSizeInMB={10} // Increased from 2MB to 10MB
          acceptedFileTypes={paymentProofTypes}
          bucketName="payment-proofs"
          buttonText="Upload Payment Receipt"
        />
        <p className="text-xs text-gray-500">
          Upload a screenshot or photo of your payment receipt (Max: 10MB, Formats: JPEG, PNG, PDF, WebP, etc.)
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
