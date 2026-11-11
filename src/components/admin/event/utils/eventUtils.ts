
/**
 * Convert 24-hour time to 12-hour format with AM/PM for display
 */
export const formatTimeDisplay = (time24: string): string => {
  if (!time24) return "";
  const [hour, minute] = time24.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hour12}:${minute} ${period}`;
};

/**
 * Convert 12-hour time with AM/PM to 24-hour format for database
 */
export const formatTimeForStorage = (time12: string): string => {
  if (!time12) return "";
  const [timePart, period] = time12.split(' ');
  const [hourStr, minute] = timePart.split(':');
  let hour = parseInt(hourStr, 10);
  
  // Convert to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minute}`;
};

/**
 * Prepare event data for saving to database
 */
export const prepareEventData = (
  title: string,
  description: string,
  location: string,
  eventDate: string,
  eventTime: string,
  endDate: string | null,
  endTime: string | null,
  imageUrl: string | null,
  eventType: string = "in-person",
  onlineLink: string = ""
) => {
  // Convert 12-hour time format to 24-hour format if needed
  const time24 = eventTime.includes('AM') || eventTime.includes('PM')
    ? formatTimeForStorage(eventTime)
    : eventTime;
    
  const endTime24 = endTime && (endTime.includes('AM') || endTime.includes('PM'))
    ? formatTimeForStorage(endTime)
    : endTime;
      
  const combinedEventDate = new Date(`${eventDate}T${time24}`);
    
  let combinedEndDate = null;
  if (endDate && endTime24) {
    combinedEndDate = new Date(`${endDate}T${endTime24}`);
  }

  return {
    title,
    description,
    location,
    event_date: combinedEventDate.toISOString(),
    end_date: combinedEndDate ? combinedEndDate.toISOString() : null,
    image_url: imageUrl || null,
    event_type: eventType,
    online_link: onlineLink || null,
  };
};
