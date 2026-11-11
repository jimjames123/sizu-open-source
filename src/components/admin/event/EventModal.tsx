
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTimeDisplay } from "./utils/eventUtils";
import { useEventForm } from "./hooks/useEventForm";
import EventForm from "./components/EventForm";
import EventFooter from "./components/EventFooter";

interface EventModalProps {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  event?: any | null;
}

const EventModal = ({ isOpen, onClose, event }: EventModalProps) => {
  const {
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
  } = useEventForm({ event, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <EventForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventTime={eventTime}
            setEventTime={setEventTime}
            endDate={endDate}
            setEndDate={setEndDate}
            endTime={endTime}
            setEndTime={setEndTime}
            imageUrl={imageUrl}
            handleFileUpload={handleFileUpload}
            formatTimeDisplay={formatTimeDisplay}
            eventType={eventType}
            setEventType={setEventType}
            onlineLink={onlineLink}
            setOnlineLink={setOnlineLink}
          />
          
          <EventFooter 
            isSubmitting={isSubmitting} 
            onCancel={() => onClose(false)}
            isEditMode={!!event}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
