
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { asSupabaseParam } from "@/utils/supabaseUtils";
import { prepareEventData } from "../utils/eventUtils";

interface UseEventFormProps {
  event?: any | null;
  onClose: (refresh: boolean) => void;
}

export const useEventForm = ({ event, onClose }: UseEventFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventType, setEventType] = useState("in-person");
  const [onlineLink, setOnlineLink] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setLocation(event.location || "");
      setEventType(event.event_type || "in-person");
      setOnlineLink(event.online_link || "");
      
      if (event.event_date) {
        const date = new Date(event.event_date);
        setEventDate(format(date, "yyyy-MM-dd"));
        setEventTime(format(date, "HH:mm"));
      }
      
      if (event.end_date) {
        const date = new Date(event.end_date);
        setEndDate(format(date, "yyyy-MM-dd"));
        setEndTime(format(date, "HH:mm"));
      } else {
        setEndDate("");
        setEndTime("");
      }
      
      setImageUrl(event.image_url || "");
    } else {
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate("");
    setEventTime("");
    setEndDate("");
    setEndTime("");
    setImageUrl("");
    setEventType("in-person");
    setOnlineLink("");
  };

  // Function to handle image upload
  const handleFileUpload = (url: string | null) => {
    setImageUrl(url || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields based on event type
    const isLocationRequired = eventType === "in-person" && !location;
    const isOnlineLinkRequired = eventType === "online" && !onlineLink;
    
    if (!title || !eventDate || !eventTime || !endDate || !endTime || isLocationRequired || isOnlineLinkRequired) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields including end date and time",
        variant: "destructive",
      });
      return;
    }
    
    // Validate online link format if provided
    if (eventType === "online" && onlineLink && !onlineLink.startsWith("http")) {
      toast({
        title: "Invalid link format",
        description: "Online event link must start with http or https",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call the ensure-storage-buckets function to make sure buckets exist
      try {
        await fetch(`https://qrrziayuzfdfvkptywgt.supabase.co/functions/v1/ensure-storage-buckets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
          }
        });
      } catch (error) {
        console.warn("Could not verify storage buckets:", error);
        // Continue anyway, as this is just a precaution
      }
      
      // Prepare event data
      const eventData = prepareEventData(
        title,
        description,
        eventType === "in-person" ? location : "",
        eventDate,
        eventTime,
        endDate,
        endTime,
        imageUrl,
        eventType,
        eventType === "online" ? onlineLink : ""
      );
      
      if (event) {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", asSupabaseParam(event.id));
          
        if (error) throw error;
        
        toast({
          title: "Event updated",
          description: "The event has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from("events")
          .insert(eventData);
          
        if (error) throw error;
        
        toast({
          title: "Event created",
          description: "The event has been successfully created",
        });
      }
      
      onClose(true);
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast({
        title: "Error saving event",
        description: error.message || "Could not save the event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    location,
    setLocation,
    eventDate,
    setEventDate,
    eventTime,
    setEventTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    imageUrl,
    handleFileUpload,
    isSubmitting,
    handleSubmit,
    eventType,
    setEventType,
    onlineLink,
    setOnlineLink
  };
};
