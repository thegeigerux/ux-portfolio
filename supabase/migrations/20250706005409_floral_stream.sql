/*
  # Create About Page Management Tables

  1. New Tables
    - `about_profile`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `bio` (text)
      - `profile_image` (text)
      - `resume_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `career_timeline`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `period` (text)
      - `description` (text)
      - `icon` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `level` (integer)
      - `category` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `year` (text)
      - `icon` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for portfolio visibility
    - Authenticated write access for content management

  3. Sample Data
    - Insert default profile information
    - Insert sample career timeline entries
    - Insert sample skills and achievements
*/

-- Create about_profile table
CREATE TABLE IF NOT EXISTS about_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'James Geiger, M. Ed.',
  title text NOT NULL DEFAULT 'Product Designer',
  bio text NOT NULL DEFAULT 'Hello! I''m James, a passionate full-stack developer with over 5 years of experience building modern web applications.',
  profile_image text NOT NULL DEFAULT '/IMG_2698.jpeg',
  resume_url text DEFAULT '#',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_timeline table
CREATE TABLE IF NOT EXISTS career_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT '💼',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL CHECK (level >= 0 AND level <= 100),
  category text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  year text NOT NULL,
  icon text NOT NULL DEFAULT '🏆',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE about_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Profile is publicly readable"
  ON about_profile FOR SELECT TO public USING (true);

CREATE POLICY "Career timeline is publicly readable"
  ON career_timeline FOR SELECT TO public USING (true);

CREATE POLICY "Skills are publicly readable"
  ON skills FOR SELECT TO public USING (true);

CREATE POLICY "Achievements are publicly readable"
  ON achievements FOR SELECT TO public USING (true);

-- Create policies for authenticated users (content management)
CREATE POLICY "Authenticated users can manage profile"
  ON about_profile FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage career timeline"
  ON career_timeline FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage achievements"
  ON achievements FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_about_profile_updated_at
  BEFORE UPDATE ON about_profile
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

CREATE TRIGGER update_career_timeline_updated_at
  BEFORE UPDATE ON career_timeline
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

-- Insert default profile data
INSERT INTO about_profile (name, title, bio, profile_image, resume_url) VALUES (
  'James Geiger, M. Ed.',
  'Product Designer',
  'Hello! I''m James, a passionate full-stack developer with over 5 years of experience building modern web applications. I specialize in React, Next.js, and Firebase, focusing on creating intuitive and performant user experiences. My journey in web development began when I built my first website during college. Since then, I''ve worked with various companies and clients to deliver solutions that combine technical excellence with user-centric design.',
  '/IMG_2698.jpeg',
  '#'
);

-- Insert sample career timeline data
INSERT INTO career_timeline (title, company, period, description, icon, order_index) VALUES
('Associate Product Designer', 'Lowe''s', '2024-Present', 'Leading design initiatives for digital products, collaborating with cross-functional teams to create intuitive user experiences.', '💼', 1),
('Freelancer', 'Self', '2012-2024', 'Created user-centered designs for various clients across retail, finance, and healthcare sectors.', '🎨', 2),
('Master of Education', 'University of South Florida', '2001-2012', 'Instructional Technology', '🎓', 3);

-- Insert sample skills data
INSERT INTO skills (name, level, category, order_index) VALUES
('Figma', 75, 'Design', 1),
('Prototyping', 75, 'Design', 2),
('UI/UX Design', 95, 'Design', 3),
('Design Systems', 88, 'Design', 4),
('Accessibility', 92, 'Design', 5),
('User Research', 80, 'Design', 6),
('React', 10, 'Frontend', 7),
('Javascript', 25, 'Frontend', 8),
('TypeScript', 85, 'Frontend', 9);

-- Insert sample achievements data
INSERT INTO achievements (title, description, year, icon, order_index) VALUES
('Design Excellence Award', 'Recognized for outstanding UI/UX design in the annual design competition.', '2023', '🏆', 1),
('50+ Happy Clients', 'Successfully delivered projects for clients across various industries.', '2023', '👥', 2),
('1000+ Cups of Coffee', 'Fueled countless late-night design sessions and creative breakthroughs.', 'Ongoing', '☕', 3);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_career_timeline_order ON career_timeline(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_achievements_order ON achievements(order_index);