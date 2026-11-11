
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MtnPaymentInstructions from "./payment-methods/MtnPaymentInstructions";
import AirtelPaymentInstructions from "./payment-methods/AirtelPaymentInstructions";
import BankTransferInstructions from "./payment-methods/BankTransferInstructions";

const PaymentMethodTabs: React.FC = () => {
  return (
    <Tabs defaultValue="mtn" className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="mtn">MTN</TabsTrigger>
        <TabsTrigger value="airtel">Airtel</TabsTrigger>
        <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
      </TabsList>
      
      <div className="min-h-[200px]">
        <TabsContent value="mtn" className="p-4 border rounded-md mt-2 h-full">
          <MtnPaymentInstructions />
        </TabsContent>

        <TabsContent value="airtel" className="p-4 border rounded-md mt-2 h-full">
          <AirtelPaymentInstructions />
        </TabsContent>

        <TabsContent value="bank" className="p-4 border rounded-md mt-2 h-full">
          <BankTransferInstructions />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default PaymentMethodTabs;
