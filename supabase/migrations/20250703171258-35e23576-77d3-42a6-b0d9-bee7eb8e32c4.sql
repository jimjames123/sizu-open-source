-- Add event type and online link fields to events table
ALTER TABLE public.events 
ADD COLUMN event_type text DEFAULT 'in-person' CHECK (event_type IN ('online', 'in-person')),
ADD COLUMN online_link text;