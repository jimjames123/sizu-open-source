
import React from "react";

const BankTransferInstructions: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="font-medium mb-3">Bank Transfer Details (International)</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">Bank:</div>
          <div>United Bank for Africa Uganda Ltd</div>
          
          <div className="font-medium">Swift Code:</div>
          <div className="font-mono">UNAFUGKA</div>
          
          <div className="font-medium">Account Name:</div>
          <div>SIZUNET (U) LIMITED</div>
          
          <div className="font-medium">Account Number:</div>
          <div className="font-mono">0353001358</div>
          
          <div className="font-medium">Branch:</div>
          <div>Mukono</div>
          
          <div className="font-medium">Country:</div>
          <div>Uganda</div>
          
          <div className="font-medium">Amount:</div>
          <div><span className="font-bold">USD 15</span> or equivalent in other currencies</div>
        </div>
        <p className="text-xs mt-2 italic">Note: Quote the name of the organisation whose account you are paying for as reason.</p>
      </div>
    </div>
  );
};

export default BankTransferInstructions;
