import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, ClockIcon, UserIcon, TagIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import ImageGallery from '../components/ImageGallery';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  images: string[];
  category_id: string;
  author_name: string;
  author_email: string;
  author_avatar: string;
  status: string;
  featured: boolean;
  read_time: number;
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    color: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPost() {
      if (!slug) return;

      try {
        setLoading(true);
        
        // Fetch the specific blog post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            category:blog_categories(name, color),
            tags:blog_post_tags(
              tag:blog_tags(id, name, color)
            )
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (postError) {
          throw postError;
        }

        if (postData) {
          const transformedPost: BlogPost = {
            ...postData,
            tags: postData.tags?.map((t: any) => t.tag) || []
          };

          setPost(transformedPost);

          // Increment view count
          await supabase.rpc('increment_post_views', { post_slug: slug });

          // Fetch related posts (same category or tags, excluding current post)
          const { data: relatedData } = await supabase
            .from('blog_posts')
            .select(`
              *,
              category:blog_categories(name, color),
              tags:blog_post_tags(
                tag:blog_tags(id, name, color)
              )
            `)
            .neq('id', postData.id)
            .eq('status', 'published')
            .limit(3)
            .order('published_at', { ascending: false });

          if (relatedData) {
            const transformedRelated = relatedData.map(p => ({
              ...p,
              tags: p.tags?.map((t: any) => t.tag) || []
            }));
            setRelatedPosts(transformedRelated);
          }
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 theme-text-secondary">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 theme-text">Post Not Found</h1>
            <p className="theme-text-secondary mb-8">
              {error || 'The blog post you\'re looking for doesn\'t exist.'}
            </p>
            <Link to="/blog">
              <GlowButton variant="outline" className="flex items-center gap-2 mx-auto">
                Back to Blog <ArrowRightIcon />
              </GlowButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const postImages = post.images && post.images.length > 0 
    ? post.images 
    : [post.featured_image];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm theme-text-secondary">
            <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <ArrowRightIcon />
            <span className="theme-text">{post.title}</span>
          </div>
        </nav>

        {/* Post Header */}
        <div className="mb-12">
          {post.featured && (
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full border border-purple-200 dark:border-purple-800">
                Featured Post
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-royal leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl theme-text-secondary mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm theme-text-secondary mb-8">
            <div className="flex items-center gap-2">
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon />
              {new Date(post.published_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon />
              {post.read_time} min read
            </div>
            <div className="flex items-center gap-1">
              <UserIcon />
              {post.views} views
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {post.category && (
              <span 
                className="px-3 py-1 text-xs rounded-full border"
                style={{ 
                  backgroundColor: `${post.category.color}20`,
                  borderColor: `${post.category.color}50`,
                  color: post.category.color
                }}
              >
                {post.category.name}
              </span>
            )}
            {post.tags?.map((tag) => (
              <span
                key={tag.id}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full border"
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  borderColor: `${tag.color}50`,
                  color: tag.color
                }}
              >
                <TagIcon />
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Image/Gallery */}
        <div className="mb-12">
          <ImageGallery 
            images={postImages}
            title={post.title}
            className="w-full"
          />
        </div>

        {/* Post Content */}
        <GlassCard className="mb-16">
          <div className="p-8">
            <div className="prose prose-lg theme-text max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                // Handle markdown-style headers
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mb-6 mt-8 gradient-text-royal leading-tight">
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mb-4 mt-6 theme-text">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold mb-3 mt-4 theme-text">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                
                // Handle lists
                if (paragraph.includes('- ')) {
                  const items = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
                  return (
                    <ul key={index} className="list-disc list-inside mb-4 space-y-2">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="theme-text-secondary">
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Regular paragraphs
                return (
                  <p key={index} className="mb-4 leading-relaxed theme-text-secondary">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Author Bio */}
        <GlassCard className="mb-16">
          <div className="p-8">
            <div className="flex items-start gap-6">
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold mb-2 theme-text">About {post.author_name}</h3>
                <p className="theme-text-secondary mb-4">
                  Product designer obsessed with accessibility, rapid prototyping, and AI‑driven innovation. 
                  Partnering with teams to turn bold ideas into inclusive, responsive experiences.
                </p>
                <Link to="/contact">
                  <GlowButton variant="outline" className="flex items-center gap-2">
                    Get In Touch <ArrowRightIcon />
                  </GlowButton>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 gradient-text-royal leading-tight">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <GlassCard className="group overflow-hidden h-full">
                    <ImageGallery 
                      images={relatedPost.images && relatedPost.images.length > 0 
                        ? relatedPost.images 
                        : [relatedPost.featured_image]}
                      title={relatedPost.title}
                      className="aspect-video"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm theme-text-secondary mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon />
                          {new Date(relatedPost.published_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon />
                          {relatedPost.read_time} min read
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 theme-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="theme-text-secondary mb-4">{relatedPost.excerpt}</p>
                      {relatedPost.category && (
                        <span 
                          className="px-2 py-1 text-xs rounded-full border"
                          style={{ 
                            backgroundColor: `${relatedPost.category.color}20`,
                            borderColor: `${relatedPost.category.color}50`,
                            color: relatedPost.category.color
                          }}
                        >
                          {relatedPost.category.name}
                        </span>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="text-center">
          <GlassCard className="max-w-2xl mx-auto">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-royal leading-tight">
                Stay Updated
              </h3>
              <p className="theme-text-secondary mb-6">
                Get the latest insights on design and development delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 rounded-lg theme-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <GlowButton>
                  Subscribe
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;