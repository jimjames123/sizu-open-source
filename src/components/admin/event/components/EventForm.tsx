
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TimeDisplay from "./TimeDisplay";
import ImageUploader from "./ImageUploader";

interface EventFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  eventDate: string;
  setEventDate: (value: string) => void;
  eventTime: string;
  setEventTime: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  imageUrl: string;
  handleFileUpload: (url: string | null) => void;
  formatTimeDisplay: (time24: string) => string;
  eventType: string;
  setEventType: (value: string) => void;
  onlineLink: string;
  setOnlineLink: (value: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({
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
  formatTimeDisplay,
  eventType,
  setEventType,
  onlineLink,
  setOnlineLink
}) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-right">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event description"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-right">
          Event Type <span className="text-red-500">*</span>
        </Label>
        <RadioGroup value={eventType} onValueChange={setEventType} className="flex flex-row gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="in-person" />
            <Label htmlFor="in-person">In-person</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">Online</Label>
          </div>
        </RadioGroup>
      </div>
      
      {eventType === "in-person" && (
        <div className="space-y-2">
          <Label htmlFor="location" className="text-right">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Event location"
            required
          />
        </div>
      )}
      
      {eventType === "online" && (
        <div className="space-y-2">
          <Label htmlFor="onlineLink" className="text-right">
            Online Event Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="onlineLink"
            value={onlineLink}
            onChange={(e) => setOnlineLink(e.target.value)}
            placeholder="https://zoom.us/j/... or Google Meet link"
            required
            type="url"
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-right">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventTime" className="text-right">
            Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="eventTime"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
          <TimeDisplay time={eventTime} formatTimeDisplay={formatTimeDisplay} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-right">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-right">
            End Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <TimeDisplay time={endTime} formatTimeDisplay={formatTimeDisplay} />
        </div>
      </div>
      
      <ImageUploader
        imageUrl={imageUrl}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default EventForm;
