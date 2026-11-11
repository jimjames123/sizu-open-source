
import React from "react";

const MtnPaymentInstructions: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="font-medium mb-3">MTN Mobile Money Instructions</h3>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Dial <span className="font-mono font-bold">*165*3#</span></li>
          <li>Enter merchant code: <span className="font-mono font-bold">751136</span></li>
          <li>Enter amount of <span className="font-bold">UGX 45,000</span> (forty five thousand)</li>
          <li>Enter your PIN to confirm</li>
        </ol>
      </div>
    </div>
  );
};

export default MtnPaymentInstructions;
