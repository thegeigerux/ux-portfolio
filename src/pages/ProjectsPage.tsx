import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon, GithubIcon, CalendarIcon, TagIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import ImageGallery from '../components/ImageGallery';
import { supabase, Project } from '../lib/supabase';

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const filters = ['All', 'Web Design', 'Mobile Apps', 'UI/UX', 'Frontend', 'Branding'];

  // Fetch projects from Supabase "Projects" table
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match our expected format
        const transformedProjects: Project[] = data?.map(project => ({
          id: project.id,
          title: project.title || 'Untitled Project',
          description: project.description || 'No description available.',
          long_description: project.long_description || project.description || 'No description available.',
          image: project.image || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
          images: project.images || [],
          tags: project.tags || ['Web Design'],
          technologies: project.technologies || ['React', 'TypeScript'],
          date: project.date || new Date().toISOString().split('T')[0],
          status: project.status || 'Completed',
          live_url: project.live_url || '#',
          github_url: project.github_url || '#',
          created_at: project.created_at,
          updated_at: project.updated_at
        })) || [];

        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        
        // Fallback to static data if Supabase fails
        setProjects([
          {
            id: '1',
            title: 'E-commerce Platform',
            description: 'Modern shopping experience with advanced filtering, wishlist functionality, and seamless checkout process. Built with React and integrated with Stripe for payments.',
            long_description: 'A comprehensive e-commerce solution that revolutionizes online shopping. Features include intelligent product recommendations, real-time inventory management, and mobile-first responsive design.',
            image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
            tags: ['Web Design', 'UI/UX', 'Frontend'],
            technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Stripe API'],
            date: '2024-01-20',
            status: 'Completed',
            live_url: '#',
            github_url: '#',
          },
          {
            id: '2',
            title: 'Mobile Banking App',
            description: 'Secure and intuitive banking interface for iOS and Android platforms with biometric authentication and real-time transaction tracking.',
            long_description: 'A next-generation mobile banking application prioritizing security and user experience. Features include budget tracking, expense categorization, and seamless money transfers.',
            image: 'https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=600',
            tags: ['Mobile Apps', 'UI/UX', 'Fintech'],
            technologies: ['React Native', 'Firebase', 'Biometric Auth'],
            date: '2024-01-15',
            status: 'In Progress',
            live_url: '#',
            github_url: '#',
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.tags?.includes(activeFilter));

  if (loading) {
    return (
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400 mx-auto"></div>
            <p className="mt-4 text-slate-300">Loading projects from Supabase...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-10 gradient-text-royal leading-tight">
            My Projects
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A collection of my recent work spanning web design, mobile applications, and digital experiences. 
            Each project represents a unique challenge and creative solution.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm max-w-md mx-auto">
              <p>⚠️ Using fallback data. Supabase connection: {error}</p>
            </div>
          )}
          {!error && projects.length > 0 && (
            <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm max-w-md mx-auto">
              <p>✅ Connected to Supabase! Showing {projects.length} projects from your "Projects" table.</p>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-sky-600 via-purple-700 to-rose-700 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group">
              <Link to={`/projects/${project.id}`}>
                <GlassCard className="group overflow-hidden h-full">
                  <ImageGallery 
                    images={project.images && project.images.length > 0 ? project.images : [project.image || '']}
                    title={project.title}
                    className="aspect-video"
                  />
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                          : 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                      }`}>
                        {project.status}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <CalendarIcon />
                        {new Date(project.date || '').toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-sky-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {project.long_description || project.description}
                    </p>
                    
                    {project.images && project.images.length > 1 && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-slate-400">
                          📸 {project.images.length} images in gallery
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="flex items-center gap-1 tag-3d px-3 py-1 text-xs rounded-full text-sky-400"
                        >
                          <TagIcon />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
              
              {/* External action buttons - outside the link */}
              <div className="flex justify-end gap-3 mt-4 px-8">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-sky-400"
                >
                  <ExternalLinkIcon />
                </a>
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-purple-400"
                >
                  <GithubIcon />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No projects found for the selected filter.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-20">
          <GlassCard className="max-w-2xl mx-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 gradient-text-royal leading-tight">
                Interested in working together?
              </h2>
              <p className="text-slate-300 mb-6">
                I'm always open to discussing new projects and creative challenges.
              </p>
              <GlowButton className="mx-auto">
                Get In Touch
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;