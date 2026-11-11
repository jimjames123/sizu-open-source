
import React from "react";

interface TimeDisplayProps {
  time: string;
  formatTimeDisplay: (time24: string) => string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ time, formatTimeDisplay }) => {
  if (!time) return null;
  
  return (
    <div className="text-xs text-gray-500">
      {formatTimeDisplay(time)}
    </div>
  );
};

export default TimeDisplay;
