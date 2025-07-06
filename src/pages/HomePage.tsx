import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ExternalLinkIcon, CalendarIcon, UserIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import ImageGallery from '../components/ImageGallery';
import { supabase, Project } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  author_name: string;
  published_at: string;
  read_time: number;
}
const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);

  // Fetch featured projects from Supabase "Projects" table
  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const { data, error } = await supabase
          .from('Projects')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match our expected format
        const transformedProjects: Project[] = data?.map(project => ({
          id: project.id,
          title: project.title || 'Untitled Project',
          description: project.description || 'No description available.',
          image: project.image || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
          images: project.images || [],
          tags: project.tags || ['UI/UX', 'Frontend', 'React'],
        })) || [];

        setFeaturedProjects(transformedProjects);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        
        // Fallback to static data if Supabase fails
        setFeaturedProjects([
          {
            id: '1',
            title: 'E-commerce Platform',
            description: 'Modern shopping experience with advanced filtering and seamless checkout.',
            image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['UI/UX', 'Frontend', 'React'],
          },
          {
            id: '2',
            title: 'Mobile Banking App',
            description: 'Secure and intuitive banking interface for iOS and Android platforms.',
            image: 'https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['Mobile', 'Fintech', 'Design'],
          },
          {
            id: '3',
            title: 'SaaS Dashboard',
            description: 'Clean and powerful analytics dashboard for business intelligence.',
            image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['Dashboard', 'Analytics', 'SaaS'],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  // Fetch latest blog posts from Supabase
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, featured_image, author_name, published_at, read_time')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        setBlogPosts(data || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        // Fallback to empty array if fetch fails
        setBlogPosts([]);
      } finally {
        setBlogLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 hero-bg">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-12 gradient-text-royal leading-tight">
              Product Designer
            </h1>
            <p className="text-xl md:text-2xl theme-text-secondary max-w-3xl mx-auto leading-relaxed">
              Product designer obsessed with accessibility, rapid prototyping, and AI‑driven innovation. Partnering with teams to turn bold ideas into inclusive, responsive experiences—fast. Let's build digital products that empower every user and push what's possible.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/projects">
              <GlowButton className="flex items-center gap-2">
                View My Work <ArrowRightIcon />
              </GlowButton>
            </Link>
            <Link to="/contact">
              <GlowButton variant="outline" className="flex items-center gap-2">
                Get In Touch <ExternalLinkIcon />
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 theme-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text-royal leading-tight">
              Featured Projects
            </h2>
            <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
              A showcase of my latest work across web design, mobile apps, and digital experiences.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 theme-text-secondary">Loading featured projects from Supabase...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <GlassCard className="group overflow-hidden h-full">
                    <ImageGallery 
                      images={project.images && project.images.length > 0 ? project.images : [project.image || '']}
                      title={project.title}
                      className="aspect-video"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 theme-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="theme-text-secondary mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/projects">
              <GlowButton variant="outline" className="flex items-center gap-2 mx-auto">
                View All Projects <ArrowRightIcon />
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 px-4 section-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text-royal leading-tight">
              Latest Insights
            </h2>
            <p className="text-xl theme-text-secondary max-w-2xl mx-auto">
              Thoughts on design, development, and the future of digital experiences.
            </p>
          </div>
          
          {blogLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 theme-text-secondary">Loading latest blog posts...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <GlassCard className="group overflow-hidden h-full">
                    <ImageGallery 
                      images={[post.featured_image]}
                      title={post.title}
                      className="aspect-video"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm theme-text-secondary mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon />
                          {new Date(post.published_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon />
                          {post.author_name}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 theme-text group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="theme-text-secondary mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm theme-text-secondary">{post.read_time} min read</span>
                        <div className="flex items-center gap-2 theme-text-secondary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <span className="text-sm font-medium">Read More</span>
                          <ArrowRightIcon />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="theme-text-secondary">No blog posts available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/blog">
              <GlowButton variant="outline" className="flex items-center gap-2 mx-auto">
                Read More Articles <ArrowRightIcon />
              </GlowButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;