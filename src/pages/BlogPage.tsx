import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, UserIcon, ArrowRightIcon, TagIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import ImageGallery from '../components/ImageGallery';

const BlogPage = () => {
  const blogPosts = [
    {
      slug: 'future-web-design-trends-2024',
      title: 'The Future of Web Design: Trends to Watch in 2024',
      excerpt: 'Exploring emerging trends in web design and user experience that will shape the digital landscape.',
      content: 'The web design landscape is constantly evolving, with new trends emerging every year. In 2024, we\'re seeing a shift towards more immersive and interactive experiences...',
      author: 'Alex Designer',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Web Design', 'Trends', 'UX'],
      featured: true,
    },
    {
      slug: 'building-accessible-interfaces-guide',
      title: 'Building Accessible Interfaces: A Developer\'s Guide',
      excerpt: 'Best practices for creating inclusive digital experiences that work for everyone.',
      content: 'Accessibility in web design isn\'t just a nice-to-have feature—it\'s a fundamental requirement for creating inclusive digital experiences...',
      author: 'Alex Designer',
      date: '2024-01-10',
      readTime: '7 min read',
      image: 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Accessibility', 'Development', 'UX'],
      featured: false,
    },
    {
      slug: 'design-systems-at-scale-lessons',
      title: 'Design Systems at Scale: Lessons Learned',
      excerpt: 'How to build and maintain design systems for large organizations and growing teams.',
      content: 'Design systems have become essential for maintaining consistency and efficiency in large-scale projects...',
      author: 'Alex Designer',
      date: '2024-01-05',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Design Systems', 'Process', 'Team'],
      featured: false,
    },
    {
      slug: 'psychology-color-digital-design',
      title: 'The Psychology of Color in Digital Design',
      excerpt: 'Understanding how colors affect user behavior and emotional responses in digital interfaces.',
      content: 'Color plays a crucial role in how users perceive and interact with digital products...',
      author: 'Alex Designer',
      date: '2023-12-28',
      readTime: '4 min read',
      image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Psychology', 'Color Theory', 'UI Design'],
      featured: false,
    },
    {
      slug: 'responsive-design-2024-beyond-mobile',
      title: 'Responsive Design in 2024: Beyond Mobile-First',
      excerpt: 'Modern approaches to responsive design that consider all devices and contexts.',
      content: 'While mobile-first design has been the standard for years, the landscape is evolving...',
      author: 'Alex Designer',
      date: '2023-12-20',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Responsive Design', 'Mobile', 'Development'],
      featured: false,
    },
    {
      slug: 'micro-interactions-details-that-matter',
      title: 'Micro-Interactions: The Details That Matter',
      excerpt: 'How small animations and interactions can significantly improve user experience.',
      content: 'Micro-interactions are the subtle moments that make using a product feel natural and engaging...',
      author: 'Alex Designer',
      date: '2023-12-15',
      readTime: '3 min read',
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Animation', 'UX', 'Interaction Design'],
      featured: false,
    },
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-10 gradient-text-royal leading-tight">
            Blog & Insights
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Thoughts on design, development, and the future of digital experiences. 
            Sharing knowledge and lessons learned from years of creative work.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <GlassCard className="mb-16 overflow-hidden">
            <Link to={`/blog/${featuredPost.slug || 'future-web-design-trends-2024'}`} className="lg:flex">
              <div className="lg:w-1/2">
                <ImageGallery 
                  images={[featuredPost.image]}
                  title={featuredPost.title}
                  className="w-full h-64 lg:h-full"
                />
              </div>
              <div className="lg:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-full border border-purple-500/30">
                    Featured
                  </span>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <CalendarIcon />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon />
                      {featuredPost.readTime}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 hover:text-purple-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-400"
                    >
                      <TagIcon />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <UserIcon />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                    Read More <ArrowRightIcon />
                  </div>
                </div>
              </div>
            </Link>
          </GlassCard>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <Link key={index} to={`/blog/${post.slug || `post-${index + 1}`}`}>
              <GlassCard className="group overflow-hidden h-full">
                <ImageGallery 
                  images={[post.image]}
                  title={post.title}
                  className="aspect-video"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-slate-800/50 text-slate-300 rounded border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <UserIcon />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                      Read <ArrowRightIcon />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20">
          <GlassCard className="max-w-2xl mx-auto">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                Stay Updated
              </h2>
              <p className="text-slate-300 mb-6">
                Get the latest insights on design and development delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-purple-500 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;