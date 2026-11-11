
import React from "react";

const AirtelPaymentInstructions: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="font-medium mb-3">Airtel Money Instructions</h3>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Dial <span className="font-mono font-bold">*185*9#</span></li>
          <li>Enter merchant code: <span className="font-mono font-bold">4387022</span></li>
          <li>Enter amount of <span className="font-bold">UGX 45,000</span> (forty five thousand)</li>
          <li>Enter your organisation name as reference. e.g, Ubuntu technologies</li>
          <li>Enter your PIN to confirm</li>
        </ol>
        
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-sm text-orange-800">
            <span className="font-semibold">Important:</span> After payment, you'll receive a transaction reference code. 
            Enter this code in the payment reference field below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AirtelPaymentInstructions;
