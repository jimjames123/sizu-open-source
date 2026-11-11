-- Add is_active column to events table
ALTER TABLE public.events ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- Create index on is_active for better query performance
CREATE INDEX idx_events_is_active ON public.events(is_active);