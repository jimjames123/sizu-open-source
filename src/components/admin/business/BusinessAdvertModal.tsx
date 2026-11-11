import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from "../event/hooks/useImageUpload";

interface BusinessAdvertModalProps {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  advert?: any | null;
}

const BusinessAdvertModal: React.FC<BusinessAdvertModalProps> = ({
  isOpen,
  onClose,
  advert,
}) => {
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [flyerUrl, setFlyerUrl] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { uploading, uploadFile } = useImageUpload({ 
    onUpload: (url) => setFlyerUrl(url) 
  });

  useEffect(() => {
    if (advert) {
      setBusinessName(advert.business_name || "");
      setContactInfo(advert.contact_info || "");
      setPhysicalAddress(advert.physical_address || "");
      setBusinessCategory(advert.business_category || "");
      setFlyerUrl(advert.flyer_url || null);
      setStartDate(advert.start_date ? new Date(advert.start_date) : undefined);
      setEndDate(advert.end_date ? new Date(advert.end_date) : undefined);
      setIsActive(advert.is_active ?? true);
    } else {
      resetForm();
    }
  }, [advert]);

  const resetForm = () => {
    setBusinessName("");
    setContactInfo("");
    setPhysicalAddress("");
    setBusinessCategory("");
    setFlyerUrl(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setIsActive(true);
  };

  const triggerFileInput = () => {
    const input = document.getElementById('flyer-upload');
    if (input) {
      (input as HTMLInputElement).value = "";
      input.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !contactInfo || !physicalAddress || !businessCategory || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (startDate >= endDate) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const advertData = {
        business_name: businessName,
        contact_info: contactInfo,
        physical_address: physicalAddress,
        business_category: businessCategory,
        flyer_url: flyerUrl,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: isActive,
      };

      if (advert) {
        const { error } = await supabase
          .from("business_adverts")
          .update(advertData)
          .eq("id", advert.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Business advertisement updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("business_adverts")
          .insert([advertData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Business advertisement created successfully",
        });
      }

      onClose(true);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {advert ? "Edit Business Advertisement" : "Add Business Advertisement"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name *</Label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-info">Contact Information *</Label>
            <Input
              id="contact-info"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email, phone, or other contact details"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physical-address">Physical Address *</Label>
            <Input
              id="physical-address"
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              placeholder="Street address and location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-category">Business Category/Focus *</Label>
            <Textarea
              id="business-category"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              placeholder="Brief description of what the business does"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Business Flyer/Logo</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={triggerFileInput}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Flyer
                  </>
                )}
              </Button>
              <input
                id="flyer-upload"
                type="file"
                accept="image/*"
                onChange={uploadFile}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {flyerUrl && (
              <div className="mt-4 relative h-40 w-full bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={flyerUrl}
                  alt="Business flyer"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => setFlyerUrl(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is-active">Active</Label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Advertisement"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessAdvertModal;
