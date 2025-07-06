/*
  # Add Availability Status Management

  1. New Tables
    - `availability_status`
      - `id` (uuid, primary key)
      - `status` (text) - Available, Busy, Not Available
      - `message` (text) - Custom message to display
      - `is_active` (boolean) - Only one can be active at a time
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `availability_status` table
    - Add policy for public read access
    - Add policy for authenticated users to manage status

  3. Sample Data
    - Insert default availability status
*/

-- Create availability_status table
CREATE TABLE IF NOT EXISTS availability_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('Available', 'Busy', 'Not Available')),
  message text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE availability_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Availability status is publicly readable"
  ON availability_status FOR SELECT TO public USING (true);

-- Create policies for authenticated users (content management)
CREATE POLICY "Authenticated users can manage availability status"
  ON availability_status FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Create trigger for auto-updating timestamps
CREATE TRIGGER update_availability_status_updated_at
  BEFORE UPDATE ON availability_status
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

-- Insert default availability status
INSERT INTO availability_status (status, message, is_active) VALUES 
('Available', 'I''m currently accepting new freelance projects and collaborations. Let''s discuss your needs and see how I can help bring your vision to life.', true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_availability_status_active ON availability_status(is_active);