import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRightIcon, ExternalLinkIcon, GithubIcon, CalendarIcon, TagIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import ImageGallery from '../components/ImageGallery';
import { supabase, Project } from '../lib/supabase';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch the specific project
        const { data: projectData, error: projectError } = await supabase
          .from('Projects')
          .select('*')
          .eq('id', id)
          .single();

        if (projectError) {
          throw projectError;
        }

        if (projectData) {
          const transformedProject: Project = {
            id: projectData.id,
            title: projectData.title || 'Untitled Project',
            description: projectData.description || 'No description available.',
            long_description: projectData.long_description || projectData.description || 'No description available.',
            image: projectData.image || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
            images: projectData.images || [],
            tags: projectData.tags || ['Web Design'],
            technologies: projectData.technologies || ['React', 'TypeScript'],
            date: projectData.date || new Date().toISOString().split('T')[0],
            status: projectData.status || 'Completed',
            live_url: projectData.live_url || '#',
            github_url: projectData.github_url || '#',
            created_at: projectData.created_at,
            updated_at: projectData.updated_at
          };

          setProject(transformedProject);

          // Fetch related projects (same tags, excluding current project)
          if (transformedProject.tags && transformedProject.tags.length > 0) {
            const { data: relatedData } = await supabase
              .from('Projects')
              .select('*')
              .neq('id', id)
              .limit(3)
              .order('created_at', { ascending: false });

            if (relatedData) {
              const transformedRelated = relatedData.map(p => ({
                id: p.id,
                title: p.title || 'Untitled Project',
                description: p.description || 'No description available.',
                image: p.image || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
                images: p.images || [],
                tags: p.tags || ['Web Design'],
              }));
              setRelatedProjects(transformedRelated);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 theme-text-secondary">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 theme-text">Project Not Found</h1>
            <p className="theme-text-secondary mb-8">
              {error || 'The project you\'re looking for doesn\'t exist.'}
            </p>
            <Link to="/projects">
              <GlowButton variant="outline" className="flex items-center gap-2 mx-auto">
                Back to Projects <ArrowRightIcon />
              </GlowButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const projectImages = project.images && project.images.length > 0 
    ? project.images 
    : [project.image || ''];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm theme-text-secondary">
            <Link to="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <ArrowRightIcon />
            <span className="theme-text">{project.title}</span>
          </div>
        </nav>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-xs rounded-full ${
                project.status === 'Completed' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}>
                {project.status}
              </span>
              <div className="flex items-center gap-1 text-sm theme-text-secondary">
                <CalendarIcon />
                {new Date(project.date || '').toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors theme-text-secondary hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ExternalLinkIcon />
              </a>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors theme-text-secondary hover:text-purple-600 dark:hover:text-purple-400"
              >
                <GithubIcon />
              </a>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-royal leading-tight">
            {project.title}
          </h1>
          
          <p className="text-xl theme-text-secondary max-w-3xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Project Images */}
        <div className="mb-12">
          <ImageGallery 
            images={projectImages}
            title={project.title}
            className="w-full"
          />
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 gradient-text-royal leading-tight">
                  Project Overview
                </h2>
                <div className="prose prose-lg theme-text max-w-none">
                  {project.long_description?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tags */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 theme-text">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    >
                      <TagIcon />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Technologies */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 theme-text">Technologies Used</h3>
                <div className="space-y-2">
                  {project.technologies?.map((tech, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-white/5 dark:bg-white/5 rounded-lg text-sm theme-text border border-white/10 dark:border-white/10"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Project Links */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 theme-text">Project Links</h3>
                <div className="space-y-3">
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors group"
                  >
                    <ExternalLinkIcon />
                    <span className="theme-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      View Live Site
                    </span>
                  </a>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors group"
                  >
                    <GithubIcon />
                    <span className="theme-text group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      View Source Code
                    </span>
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 gradient-text-royal leading-tight">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} to={`/projects/${relatedProject.id}`}>
                  <GlassCard className="group overflow-hidden h-full">
                    <ImageGallery 
                      images={relatedProject.images && relatedProject.images.length > 0 
                        ? relatedProject.images 
                        : [relatedProject.image || '']}
                      title={relatedProject.title}
                      className="aspect-video"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 theme-text group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="theme-text-secondary mb-4">{relatedProject.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {relatedProject.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
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
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <GlassCard className="max-w-2xl mx-auto">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-royal leading-tight">
                Interested in working together?
              </h3>
              <p className="theme-text-secondary mb-6">
                I'm always open to discussing new projects and creative challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <GlowButton className="flex items-center gap-2">
                    Get In Touch <ArrowRightIcon />
                  </GlowButton>
                </Link>
                <Link to="/projects">
                  <GlowButton variant="outline" className="flex items-center gap-2">
                    View All Projects <ArrowRightIcon />
                  </GlowButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;