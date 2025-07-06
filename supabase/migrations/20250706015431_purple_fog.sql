/*
  # Add Multiple Images Support

  1. Database Changes
    - Add `images` array column to Projects table
    - Add `images` array column to blog_posts table
    - Keep existing `image` and `featured_image` columns for backward compatibility
    - Add indexes for better performance

  2. Features
    - Support for multiple images per project/blog post
    - Backward compatibility with existing single image fields
    - Easy management through admin interface
*/

-- Add images array column to Projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Projects' AND column_name = 'images'
  ) THEN
    ALTER TABLE "Projects" ADD COLUMN images text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Add images array column to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'images'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN images text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Create indexes for better performance on image arrays
CREATE INDEX IF NOT EXISTS idx_projects_images ON "Projects" USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_blog_posts_images ON blog_posts USING GIN (images);

-- Update existing projects to include their main image in the images array
UPDATE "Projects" 
SET images = ARRAY[image] 
WHERE images = ARRAY[]::text[] AND image IS NOT NULL AND image != '';

-- Update existing blog posts to include their featured image in the images array
UPDATE blog_posts 
SET images = ARRAY[featured_image] 
WHERE images = ARRAY[]::text[] AND featured_image IS NOT NULL AND featured_image != '';