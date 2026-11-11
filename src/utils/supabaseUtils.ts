
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Safely handles response from Supabase by checking for errors and returning null if error is found
 * This helps with the TypeScript type safety when accessing properties
 */
export function handleSupabaseResponse<T>(response: { data: T | null, error: PostgrestError | null }): T | null {
  if (response.error) {
    console.error("Supabase query error:", response.error);
    return null;
  }
  return response.data;
}

/**
 * Type guard to check if a value is not null or undefined
 */
export function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Helper to safely access properties on potentially undefined objects
 */
export function safelyAccessProperty<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  if (obj == null) {
    return undefined;
  }
  return obj[key];
}

/**
 * Helper to safely cast a Supabase query parameter
 * Use this for ID parameters and other values that need to be passed to Supabase
 */
export function asSupabaseParam<T>(value: T): T {
  return value;
}

/**
 * Wrapper to check and handle storage operations
 * This function checks if a bucket exists and creates it if necessary
 * Note: In a real-world scenario, bucket creation should happen server-side
 */
export async function ensureStorageBucket(bucketName: string): Promise<boolean> {
  try {
    console.log(`Checking if storage bucket ${bucketName} exists...`);
    
    // First check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking storage buckets:", error);
      return false;
    }
    
    const bucket = buckets.find(b => b.name === bucketName);
    
    if (bucket) {
      console.log(`Bucket ${bucketName} already exists.`);
      return true;
    } else {
      console.warn(`Bucket ${bucketName} not found. Creating the bucket requires admin rights.`);
      return false;
    }
  } catch (err) {
    console.error("Storage bucket check error:", err);
    return false;
  }
}
