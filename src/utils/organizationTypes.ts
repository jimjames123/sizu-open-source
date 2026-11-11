
/**
 * Centralized list of organization types used across the application
 * This ensures consistency when creating, filtering, and displaying organizations
 */
export const ORGANIZATION_TYPES = [
  "Government/Public",
  "Corporate/Private",
  "Social Enterprise",
  "Foreign Organization",
  "NGO/Non-Profit",
  "Community Based"
];

/**
 * Helper function to check if a given type is a valid organization type
 */
export const isValidOrganizationType = (type: string): boolean => {
  return ORGANIZATION_TYPES.includes(type);
};

/**
 * Get the display name for an organization type
 * This can be used for UI presentations where a different format might be needed
 */
export const getOrganizationTypeDisplayName = (type: string): string => {
  // Currently just returns the type as is, but this function allows for
  // future flexibility if display names need to differ from storage values
  return type;
};
