/*
  # Create Projects table for portfolio

  1. New Tables
    - `Projects`
      - `id` (uuid, primary key)
      - `title` (text, required) - Project title displayed in portfolio
      - `description` (text) - Short description for project cards
      - `long_description` (text) - Detailed description for project pages
      - `image` (text) - Project image URL
      - `tags` (text array) - Project categories for filtering
      - `technologies` (text array) - Technologies used in project
      - `date` (date) - Project completion/start date
      - `status` (text) - Project status with validation
      - `live_url` (text) - Link to live project
      - `github_url` (text) - Link to GitHub repository
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `Projects` table
    - Add policy for public read access (portfolio visibility)
    - Add policy for authenticated users to manage projects

  3. Sample Data
    - Insert 6 sample projects to populate the portfolio
*/

-- Drop table if it exists to ensure clean creation
DROP TABLE IF EXISTS "Projects";

-- Create the Projects table with all necessary columns
CREATE TABLE "Projects" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
  tags text[] NOT NULL DEFAULT ARRAY['Web Design'],
  technologies text[] NOT NULL DEFAULT ARRAY['React', 'TypeScript'],
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Completed',
  live_url text NOT NULL DEFAULT '#',
  github_url text NOT NULL DEFAULT '#',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add constraint for status validation
ALTER TABLE "Projects" ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('Completed', 'In Progress', 'Planning', 'On Hold'));

-- Enable Row Level Security
ALTER TABLE "Projects" ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (portfolio should be publicly viewable)
CREATE POLICY "Projects are publicly readable"
  ON "Projects"
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to insert/update/delete projects
CREATE POLICY "Authenticated users can manage projects"
  ON "Projects"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON "Projects"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample projects data
INSERT INTO "Projects" (
  title, 
  description, 
  long_description, 
  image, 
  tags, 
  technologies, 
  date, 
  status, 
  live_url, 
  github_url
) VALUES 
(
  'E-commerce Platform',
  'Modern shopping experience with advanced filtering and seamless checkout.',
  'A comprehensive e-commerce solution that revolutionizes online shopping. Features include intelligent product recommendations, real-time inventory management, mobile-first responsive design, and integrated payment processing with Stripe.',
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Web Design', 'UI/UX', 'Frontend'],
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'Node.js'],
  '2024-01-20',
  'Completed',
  'https://ecommerce-demo.example.com',
  'https://github.com/username/ecommerce-platform'
),
(
  'Mobile Banking App',
  'Secure and intuitive banking interface for iOS and Android platforms.',
  'A next-generation mobile banking application prioritizing security and user experience. Features include biometric authentication, budget tracking, expense categorization, real-time transaction notifications, and seamless money transfers.',
  'https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Mobile Apps', 'UI/UX', 'Fintech'],
  ARRAY['React Native', 'Firebase', 'Biometric Auth', 'Redux'],
  '2024-01-15',
  'In Progress',
  'https://banking-app.example.com',
  'https://github.com/username/banking-app'
),
(
  'SaaS Dashboard',
  'Clean and powerful analytics dashboard for business intelligence.',
  'A comprehensive business intelligence platform that transforms complex data into actionable insights. Features advanced charting with D3.js, custom reporting, team collaboration tools, and real-time data synchronization.',
  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Web Design', 'UI/UX', 'Frontend'],
  ARRAY['Vue.js', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSocket'],
  '2024-01-10',
  'Completed',
  'https://dashboard.example.com',
  'https://github.com/username/saas-dashboard'
),
(
  'Brand Identity System',
  'Complete brand identity design for a tech startup.',
  'A cohesive brand identity system that captures the essence of innovation and reliability. Includes comprehensive brand guidelines, logo variations, color palette, typography system, marketing materials, and digital assets for consistent brand application.',
  'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Branding', 'UI/UX'],
  ARRAY['Figma', 'Adobe Creative Suite', 'Sketch', 'Principle'],
  '2024-01-05',
  'Completed',
  'https://brand-showcase.example.com',
  'https://github.com/username/brand-identity'
),
(
  'Portfolio Website',
  'Modern portfolio website for a creative agency.',
  'A stunning portfolio website that showcases creative work through immersive storytelling and interactive elements. Built with performance and accessibility in mind, featuring smooth animations, case studies, client testimonials, and a content management system.',
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Web Design', 'Frontend'],
  ARRAY['Next.js', 'Framer Motion', 'Sanity CMS', 'Tailwind CSS'],
  '2023-12-28',
  'Completed',
  'https://portfolio.example.com',
  'https://github.com/username/portfolio-website'
),
(
  'AI-Powered Design Tool',
  'Innovative design tool leveraging artificial intelligence.',
  'A cutting-edge design application that uses machine learning to assist designers in creating layouts, suggesting color palettes, and generating design variations. Features include real-time collaboration, version control, and seamless integration with popular design tools.',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Web Design', 'UI/UX', 'Frontend'],
  ARRAY['React', 'Python', 'TensorFlow', 'WebGL', 'Socket.io'],
  '2023-12-15',
  'In Progress',
  'https://ai-design-tool.example.com',
  'https://github.com/username/ai-design-tool'
);