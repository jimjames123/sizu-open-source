export const allowedTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
];

export const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Ensure File is a native File instance
  if (!(file instanceof File)) {
    return {
      isValid: false,
      error: "The file could not be read. Please select a file from your device."
    };
  }

  // Allow any file format - removed type validation

  // Validate file size (10MB limit)
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > 10) {
    return {
      isValid: false,
      error: `File size exceeds 10MB limit. Current size: ${fileSizeInMB.toFixed(2)}MB`
    };
  }

  return { isValid: true };
};

export const generateFileName = (file: File): string => {
  const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
  return `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
};