
import { cn } from "./utils";

/**
 * Utility functions and constants for form-related components
 */

// This function generates consistent classes for search input fields with icons
export const getSearchInputClasses = (additionalClasses?: string) => {
  return cn(
    "pl-10 w-full form-input bg-white text-gray-900", // Added text-gray-900 for better visibility
    additionalClasses
  );
};

// This function generates consistent classes for select fields with icons
export const getSearchSelectClasses = (additionalClasses?: string) => {
  return cn(
    "pl-10 w-full form-input appearance-none bg-white text-gray-900", // Added text-gray-900 for better visibility
    additionalClasses
  );
};

// This function generates consistent classes for icon containers in input fields
export const getIconContainerClasses = (position: 'left' | 'right', additionalClasses?: string) => {
  return cn(
    `absolute inset-y-0 ${position === 'left' ? 'left-0' : 'right-0'} flex items-center ${position === 'left' ? 'pl-3' : 'pr-3'} pointer-events-none z-10`, // Added z-10 and adjusted padding
    additionalClasses
  );
};

export const getIconClasses = (additionalClasses?: string) => {
  return cn(
    "h-5 w-5 text-gray-400",
    additionalClasses
  );
};
