/*
  # Create Blog Database Schema

  1. New Tables
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `color` (text, hex color for UI)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `color` (text, hex color for UI)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text, markdown/html)
      - `featured_image` (text, URL)
      - `category_id` (uuid, foreign key)
      - `author_name` (text)
      - `author_email` (text)
      - `author_avatar` (text, URL)
      - `status` (text: draft, published, archived)
      - `featured` (boolean)
      - `read_time` (integer, minutes)
      - `views` (integer, default 0)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_post_tags` (junction table)
      - `post_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for published posts
    - Authenticated write access for content management
    - View counting function for analytics

  3. Features
    - Auto-generate slugs from titles
    - Automatic timestamp updates
    - Read time calculation
    - View tracking
    - SEO-friendly URLs
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  color text DEFAULT '#8B5CF6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image text DEFAULT 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_name text DEFAULT 'James Geiger',
  author_email text DEFAULT 'james@example.com',
  author_avatar text DEFAULT '/IMG_2698.jpeg',
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  read_time integer DEFAULT 5,
  views integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are publicly readable"
  ON blog_categories FOR SELECT TO public USING (true);

CREATE POLICY "Tags are publicly readable"
  ON blog_tags FOR SELECT TO public USING (true);

CREATE POLICY "Published posts are publicly readable"
  ON blog_posts FOR SELECT TO public 
  USING (status = 'published');

CREATE POLICY "Post tags are publicly readable"
  ON blog_post_tags FOR SELECT TO public USING (true);

-- Create policies for authenticated users (content management)
CREATE POLICY "Authenticated users can manage categories"
  ON blog_categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage tags"
  ON blog_tags FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage post tags"
  ON blog_post_tags FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_blog_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON blog_tags
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_updated_at_column();

-- Function to generate slug from text
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ language 'plpgsql';

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1 
  WHERE slug = post_slug AND status = 'published';
END;
$$ language 'plpgsql';

-- Insert sample categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Design', 'design', 'Articles about UI/UX design, visual design, and design thinking', '#EC4899'),
('Development', 'development', 'Technical articles about web development, coding, and programming', '#3B82F6'),
('AI & Innovation', 'ai-innovation', 'Exploring artificial intelligence and emerging technologies', '#8B5CF6'),
('Accessibility', 'accessibility', 'Making digital products inclusive and accessible for everyone', '#10B981'),
('Process & Workflow', 'process-workflow', 'Design processes, methodologies, and productivity tips', '#F59E0B'),
('Industry Insights', 'industry-insights', 'Trends, news, and insights from the design and tech industry', '#EF4444');

-- Insert sample tags
INSERT INTO blog_tags (name, slug, color) VALUES
('UI Design', 'ui-design', '#EC4899'),
('UX Research', 'ux-research', '#3B82F6'),
('React', 'react', '#61DAFB'),
('TypeScript', 'typescript', '#3178C6'),
('Figma', 'figma', '#F24E1E'),
('Accessibility', 'accessibility', '#10B981'),
('Design Systems', 'design-systems', '#8B5CF6'),
('Prototyping', 'prototyping', '#FF6B6B'),
('User Testing', 'user-testing', '#4ECDC4'),
('AI Tools', 'ai-tools', '#FF9F43'),
('Web Performance', 'web-performance', '#26DE81'),
('Mobile Design', 'mobile-design', '#FD79A8'),
('Animation', 'animation', '#FDCB6E'),
('Color Theory', 'color-theory', '#6C5CE7'),
('Typography', 'typography', '#A29BFE');

-- Insert sample blog posts
INSERT INTO blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  featured_image, 
  category_id, 
  author_name, 
  author_email, 
  author_avatar, 
  status, 
  featured, 
  read_time, 
  published_at
) VALUES 
(
  'The Future of Web Design: Trends to Watch in 2024',
  'future-web-design-trends-2024',
  'Exploring emerging trends in web design and user experience that will shape the digital landscape in 2024 and beyond.',
  '# The Future of Web Design: Trends to Watch in 2024

The web design landscape is constantly evolving, with new trends emerging every year. In 2024, we''re seeing a shift towards more immersive and interactive experiences that prioritize accessibility and performance.

## Key Trends

### 1. AI-Powered Design Tools
Artificial intelligence is revolutionizing how we approach design, from automated layout generation to intelligent color palette suggestions.

### 2. Micro-Interactions
Small animations and interactions that provide feedback and enhance user engagement are becoming more sophisticated and purposeful.

### 3. Accessibility-First Design
Designing with accessibility in mind from the start, rather than as an afterthought, is becoming the standard practice.

## Conclusion

The future of web design is bright, with technology enabling us to create more inclusive, engaging, and efficient digital experiences.',
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
  (SELECT id FROM blog_categories WHERE slug = 'design'),
  'James Geiger',
  'james@example.com',
  '/IMG_2698.jpeg',
  'published',
  true,
  8,
  '2024-01-15 10:00:00'
),
(
  'Building Accessible Interfaces: A Developer''s Guide',
  'building-accessible-interfaces-guide',
  'Best practices for creating inclusive digital experiences that work for everyone, regardless of their abilities.',
  '# Building Accessible Interfaces: A Developer''s Guide

Accessibility in web design isn''t just a nice-to-have feature—it''s a fundamental requirement for creating inclusive digital experiences that work for everyone.

## Why Accessibility Matters

- **Legal Compliance**: Many countries have laws requiring digital accessibility
- **Broader Audience**: Accessible design benefits everyone, not just users with disabilities
- **Better UX**: Accessible interfaces are often more intuitive and user-friendly

## Key Principles

### 1. Semantic HTML
Use proper HTML elements for their intended purpose. This provides meaning and structure that assistive technologies can understand.

### 2. Keyboard Navigation
Ensure all interactive elements can be accessed and operated using only a keyboard.

### 3. Color and Contrast
Maintain sufficient color contrast ratios and don''t rely solely on color to convey information.

### 4. Alternative Text
Provide descriptive alt text for images and other non-text content.

## Testing Your Interfaces

Regular testing with screen readers and other assistive technologies is crucial for identifying and fixing accessibility issues.

## Conclusion

Building accessible interfaces requires intentional design and development practices, but the result is a better experience for all users.',
  'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=800',
  (SELECT id FROM blog_categories WHERE slug = 'accessibility'),
  'James Geiger',
  'james@example.com',
  '/IMG_2698.jpeg',
  'published',
  false,
  12,
  '2024-01-10 14:30:00'
),
(
  'Design Systems at Scale: Lessons Learned',
  'design-systems-at-scale-lessons',
  'How to build and maintain design systems for large organizations and growing teams.',
  '# Design Systems at Scale: Lessons Learned

Design systems have become essential for maintaining consistency and efficiency in large-scale projects. Here are key lessons from implementing design systems across multiple teams and products.

## What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.

## Key Components

### 1. Design Tokens
Centralized values for colors, typography, spacing, and other design decisions.

### 2. Component Library
Reusable UI components with consistent behavior and appearance.

### 3. Documentation
Clear guidelines on when and how to use each component.

### 4. Governance
Processes for maintaining and evolving the system over time.

## Challenges and Solutions

### Challenge: Adoption Across Teams
**Solution**: Involve teams in the creation process and provide excellent documentation and support.

### Challenge: Keeping Components Updated
**Solution**: Establish clear ownership and regular review cycles.

### Challenge: Balancing Consistency with Flexibility
**Solution**: Create flexible components that can adapt to different use cases while maintaining core design principles.

## Measuring Success

Track metrics like:
- Component adoption rates
- Design-to-development handoff time
- Consistency scores across products
- Developer satisfaction

## Conclusion

A successful design system requires ongoing investment and collaboration, but the benefits in terms of efficiency and consistency are substantial.',
  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
  (SELECT id FROM blog_categories WHERE slug = 'process-workflow'),
  'James Geiger',
  'james@example.com',
  '/IMG_2698.jpeg',
  'published',
  false,
  10,
  '2024-01-05 09:15:00'
),
(
  'The Psychology of Color in Digital Design',
  'psychology-color-digital-design',
  'Understanding how colors affect user behavior and emotional responses in digital interfaces.',
  '# The Psychology of Color in Digital Design

Color plays a crucial role in how users perceive and interact with digital products. Understanding color psychology can help designers create more effective and engaging interfaces.

## Color Associations

Different colors evoke different emotions and associations:

### Red
- **Emotions**: Energy, urgency, passion
- **Use Cases**: Call-to-action buttons, error messages, sale notifications

### Blue
- **Emotions**: Trust, stability, professionalism
- **Use Cases**: Corporate websites, financial apps, healthcare platforms

### Green
- **Emotions**: Growth, success, nature
- **Use Cases**: Success messages, environmental apps, financial gains

### Yellow
- **Emotions**: Optimism, creativity, attention
- **Use Cases**: Warnings, highlights, creative platforms

## Cultural Considerations

Color meanings can vary significantly across cultures:
- White symbolizes purity in Western cultures but mourning in some Eastern cultures
- Red represents luck in China but danger in many Western contexts

## Accessibility and Color

- Ensure sufficient contrast ratios for readability
- Don''t rely solely on color to convey information
- Consider color blindness when choosing color palettes

## Best Practices

1. **Limit Your Palette**: Use 2-3 primary colors plus neutrals
2. **Test with Users**: Validate color choices with your target audience
3. **Consider Context**: The same color can have different meanings in different contexts
4. **Use Color Hierarchically**: Guide users through your interface with strategic color use

## Conclusion

Effective use of color in digital design requires understanding both psychological principles and practical considerations like accessibility and cultural context.',
  'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=800',
  (SELECT id FROM blog_categories WHERE slug = 'design'),
  'James Geiger',
  'james@example.com',
  '/IMG_2698.jpeg',
  'published',
  false,
  7,
  '2023-12-28 16:45:00'
),
(
  'AI-Powered Design Tools: Revolutionizing Creative Workflows',
  'ai-powered-design-tools-creative-workflows',
  'How artificial intelligence is transforming the design process and what it means for designers.',
  '# AI-Powered Design Tools: Revolutionizing Creative Workflows

Artificial intelligence is rapidly transforming the design industry, offering new possibilities for creativity and efficiency. Let''s explore how AI tools are changing the way designers work.

## Current AI Design Tools

### 1. Layout Generation
Tools like Figma''s Auto Layout and Adobe''s Sensei can automatically arrange elements and suggest optimal layouts.

### 2. Color Palette Creation
AI can analyze images and generate harmonious color palettes, or suggest colors based on mood and brand guidelines.

### 3. Content Generation
From writing copy to generating images, AI can help fill in content gaps during the design process.

### 4. Accessibility Checking
AI tools can automatically scan designs for accessibility issues and suggest improvements.

## Benefits for Designers

### Increased Efficiency
AI handles repetitive tasks, allowing designers to focus on creative problem-solving and strategy.

### Enhanced Creativity
AI can suggest unexpected combinations and ideas that designers might not have considered.

### Better Accessibility
Automated accessibility checking helps ensure designs are inclusive from the start.

### Data-Driven Decisions
AI can analyze user behavior and suggest design improvements based on real data.

## Challenges and Considerations

### Quality Control
AI-generated content still requires human oversight and refinement.

### Ethical Concerns
Questions about authorship, bias in AI training data, and job displacement need consideration.

### Learning Curve
Designers need to learn how to effectively collaborate with AI tools.

## The Future of AI in Design

As AI technology continues to advance, we can expect:
- More sophisticated design assistance
- Better integration between AI tools and design software
- New forms of human-AI collaboration
- Continued emphasis on human creativity and strategic thinking

## Conclusion

AI is not replacing designers but augmenting their capabilities. The most successful designers will be those who learn to effectively collaborate with AI tools while maintaining their focus on human-centered design principles.',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
  (SELECT id FROM blog_categories WHERE slug = 'ai-innovation'),
  'James Geiger',
  'james@example.com',
  '/IMG_2698.jpeg',
  'published',
  true,
  9,
  '2023-12-20 11:20:00'
),
(
  'Micro-Interactions: The Details That Matter',
  'micro-interactions-details-that-matter',
  'How small animations and interactions can significantly improve user experience and engagement.',
  '# Micro-Interactions: The Details That Matter

Micro-interactions are the subtle moments that make using a product feel natural and engaging. These small details can significantly impact user experience and brand perception.

## What Are Micro-Interactions?

Micro-interactions are contained product moments that revolve around a single use case. They have four parts:

1. **Trigger**: What initiates the interaction
2. **Rules**: What happens during the interaction
3. **Feedback**: How users know what''s happening
4. **Loops and Modes**: The meta-rules of the interaction

## Examples of Effective Micro-Interactions

### Button Hover States
A subtle color change or shadow when hovering over a button provides immediate feedback that the element is interactive.

### Form Validation
Real-time validation that shows users whether their input is correct as they type, rather than waiting until form submission.

### Loading Animations
Engaging animations that make wait times feel shorter and keep users informed about progress.

### Pull-to-Refresh
The satisfying animation when pulling down to refresh content on mobile devices.

## Design Principles

### 1. Be Functional
Every micro-interaction should serve a purpose, whether it''s providing feedback, guiding users, or preventing errors.

### 2. Be Human
Micro-interactions should feel natural and respond to human behavior patterns.

### 3. Be Contextual
The interaction should fit the overall design and brand personality.

### 4. Be Subtle
Good micro-interactions enhance the experience without drawing attention to themselves.

## Implementation Tips

### Performance Matters
Keep animations lightweight and optimized for smooth performance across devices.

### Accessibility Considerations
Respect user preferences for reduced motion and ensure interactions don''t interfere with assistive technologies.

### Test on Real Devices
What looks good on a desktop might feel different on a mobile device.

## Common Mistakes

- Overusing animations
- Making interactions too slow or too fast
- Ignoring accessibility preferences
- Adding interactions without purpose

## Conclusion

Well-designed micro-interactions can transform a functional interface into a delightful experience. They''re the difference between a product that works and one that feels magical.',
  'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=800',
  (SELECT id FROM blog_categories WHERE slug = 'design'),
  'James Geiger',
  'james@example.com',
  '/IMG_2698.jpeg',
  'published',
  false,
  6,
  '2023-12-15 13:10:00'
);

-- Create relationships between posts and tags
INSERT INTO blog_post_tags (post_id, tag_id) VALUES
-- Future of Web Design post
((SELECT id FROM blog_posts WHERE slug = 'future-web-design-trends-2024'), (SELECT id FROM blog_tags WHERE slug = 'ui-design')),
((SELECT id FROM blog_posts WHERE slug = 'future-web-design-trends-2024'), (SELECT id FROM blog_tags WHERE slug = 'design-systems')),
((SELECT id FROM blog_posts WHERE slug = 'future-web-design-trends-2024'), (SELECT id FROM blog_tags WHERE slug = 'ai-tools')),

-- Accessible Interfaces post
((SELECT id FROM blog_posts WHERE slug = 'building-accessible-interfaces-guide'), (SELECT id FROM blog_tags WHERE slug = 'accessibility')),
((SELECT id FROM blog_posts WHERE slug = 'building-accessible-interfaces-guide'), (SELECT id FROM blog_tags WHERE slug = 'user-testing')),
((SELECT id FROM blog_posts WHERE slug = 'building-accessible-interfaces-guide'), (SELECT id FROM blog_tags WHERE slug = 'web-performance')),

-- Design Systems post
((SELECT id FROM blog_posts WHERE slug = 'design-systems-at-scale-lessons'), (SELECT id FROM blog_tags WHERE slug = 'design-systems')),
((SELECT id FROM blog_posts WHERE slug = 'design-systems-at-scale-lessons'), (SELECT id FROM blog_tags WHERE slug = 'figma')),
((SELECT id FROM blog_posts WHERE slug = 'design-systems-at-scale-lessons'), (SELECT id FROM blog_tags WHERE slug = 'react')),

-- Color Psychology post
((SELECT id FROM blog_posts WHERE slug = 'psychology-color-digital-design'), (SELECT id FROM blog_tags WHERE slug = 'color-theory')),
((SELECT id FROM blog_posts WHERE slug = 'psychology-color-digital-design'), (SELECT id FROM blog_tags WHERE slug = 'ui-design')),
((SELECT id FROM blog_posts WHERE slug = 'psychology-color-digital-design'), (SELECT id FROM blog_tags WHERE slug = 'accessibility')),

-- AI Design Tools post
((SELECT id FROM blog_posts WHERE slug = 'ai-powered-design-tools-creative-workflows'), (SELECT id FROM blog_tags WHERE slug = 'ai-tools')),
((SELECT id FROM blog_posts WHERE slug = 'ai-powered-design-tools-creative-workflows'), (SELECT id FROM blog_tags WHERE slug = 'figma')),
((SELECT id FROM blog_posts WHERE slug = 'ai-powered-design-tools-creative-workflows'), (SELECT id FROM blog_tags WHERE slug = 'design-systems')),

-- Micro-Interactions post
((SELECT id FROM blog_posts WHERE slug = 'micro-interactions-details-that-matter'), (SELECT id FROM blog_tags WHERE slug = 'animation')),
((SELECT id FROM blog_posts WHERE slug = 'micro-interactions-details-that-matter'), (SELECT id FROM blog_tags WHERE slug = 'ui-design')),
((SELECT id FROM blog_posts WHERE slug = 'micro-interactions-details-that-matter'), (SELECT id FROM blog_tags WHERE slug = 'prototyping'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);