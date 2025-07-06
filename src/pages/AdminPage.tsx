import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { 
  ArrowRightIcon, 
  ExternalLinkIcon, 
  CalendarIcon, 
  TagIcon, 
  UserIcon,
  XIcon,
  MenuIcon
} from '../components/SimpleIcons';

interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image: string;
  images: string[];
  tags: string[];
  technologies: string[];
  date: string;
  status: string;
  live_url: string;
  github_url: string;
  created_at: string;
  updated_at: string;
}

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface AboutProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  profile_image: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
}

interface CareerTimelineItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface AvailabilityStatus {
  id: string;
  status: string;
  message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [aboutProfile, setAboutProfile] = useState<AboutProfile | null>(null);
  const [careerTimeline, setCareerTimeline] = useState<CareerTimelineItem[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [availabilityStatuses, setAvailabilityStatuses] = useState<AvailabilityStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [imageInputs, setImageInputs] = useState<string[]>(['']);

  // Fetch data functions
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('Projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProjects(data);
    }
  };

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(name, color),
        tags:blog_post_tags(
          tag:blog_tags(id, name, color)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const transformedPosts = data.map(post => ({
        ...post,
        tags: post.tags?.map((t: any) => t.tag) || []
      }));
      setBlogPosts(transformedPosts);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setTags(data);
    }
  };

  const fetchAboutProfile = async () => {
    const { data, error } = await supabase
      .from('about_profile')
      .select('*')
      .single();
    
    if (!error && data) {
      setAboutProfile(data);
    }
  };

  const fetchCareerTimeline = async () => {
    const { data, error } = await supabase
      .from('career_timeline')
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setCareerTimeline(data);
    }
  };

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setSkills(data);
    }
  };

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order_index');
    
    if (!error && data) {
      setAchievements(data);
    }
  };

  const fetchAvailabilityStatuses = async () => {
    const { data, error } = await supabase
      .from('availability_status')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setAvailabilityStatuses(data);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchBlogPosts();
    fetchCategories();
    fetchTags();
    fetchAboutProfile();
    fetchCareerTimeline();
    fetchSkills();
    fetchAchievements();
    fetchAvailabilityStatuses();
  }, []);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'tags' || name === 'technologies') {
      // Handle array inputs
      const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({ ...prev, [name]: arrayValue }));
    } else if (name === 'level') {
      // Handle numeric inputs
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'order_index') {
      // Handle numeric inputs
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name.startsWith('image_')) {
      // Handle multiple image inputs
      const index = parseInt(name.split('_')[1]);
      const newImageInputs = [...imageInputs];
      newImageInputs[index] = value;
      setImageInputs(newImageInputs);
      
      // Update formData with non-empty images
      const images = newImageInputs.filter(img => img.trim() !== '');
      setFormData(prev => ({ ...prev, images }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (activeTab === 'projects') {
        const projectData = {
          ...formData,
          tags: Array.isArray(formData.tags) ? formData.tags : formData.tags?.split(',').map((t: string) => t.trim()) || [],
          technologies: Array.isArray(formData.technologies) ? formData.technologies : formData.technologies?.split(',').map((t: string) => t.trim()) || [],
          images: formData.images || []
        };

        if (editingItem) {
          result = await supabase
            .from('Projects')
            .update(projectData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('Projects')
            .insert([projectData]);
        }
        
        if (!result.error) {
          fetchProjects();
        }
      } else if (activeTab === 'posts') {
        const postData = {
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
          read_time: Math.ceil((formData.content?.length || 0) / 1000), // Rough estimate
          images: formData.images || []
        };

        if (editingItem) {
          result = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('blog_posts')
            .insert([postData]);
        }
        
        if (!result.error) {
          fetchBlogPosts();
        }
      } else if (activeTab === 'categories') {
        const categoryData = {
          ...formData,
          slug: formData.slug || generateSlug(formData.name)
        };

        if (editingItem) {
          result = await supabase
            .from('blog_categories')
            .update(categoryData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('blog_categories')
            .insert([categoryData]);
        }
        
        if (!result.error) {
          fetchCategories();
        }
      } else if (activeTab === 'tags') {
        const tagData = {
          ...formData,
          slug: formData.slug || generateSlug(formData.name)
        };

        if (editingItem) {
          result = await supabase
            .from('blog_tags')
            .update(tagData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('blog_tags')
            .insert([tagData]);
        }
        
        if (!result.error) {
          fetchTags();
        }
      } else if (activeTab === 'profile') {
        if (editingItem) {
          result = await supabase
            .from('about_profile')
            .update(formData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('about_profile')
            .insert([formData]);
        }
        
        if (!result.error) {
          fetchAboutProfile();
        }
      } else if (activeTab === 'timeline') {
        if (editingItem) {
          result = await supabase
            .from('career_timeline')
            .update(formData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('career_timeline')
            .insert([formData]);
        }
        
        if (!result.error) {
          fetchCareerTimeline();
        }
      } else if (activeTab === 'skills') {
        if (editingItem) {
          result = await supabase
            .from('skills')
            .update(formData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('skills')
            .insert([formData]);
        }
        
        if (!result.error) {
          fetchSkills();
        }
      } else if (activeTab === 'achievements') {
        if (editingItem) {
          result = await supabase
            .from('achievements')
            .update(formData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('achievements')
            .insert([formData]);
        }
        
        if (!result.error) {
          fetchAchievements();
        }
      } else if (activeTab === 'availability') {
        // First, set all other statuses to inactive
        if (formData.is_active) {
          await supabase
            .from('availability_status')
            .update({ is_active: false })
            .neq('id', editingItem?.id || '');
        }

        if (editingItem) {
          result = await supabase
            .from('availability_status')
            .update(formData)
            .eq('id', editingItem.id);
        } else {
          result = await supabase
            .from('availability_status')
            .insert([formData]);
        }
        
        if (!result.error) {
          fetchAvailabilityStatuses();
        }
      }

      if (result?.error) {
        alert('Error: ' + result.error.message);
      } else {
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
        alert(editingItem ? 'Updated successfully!' : 'Created successfully!');
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'projects') {
      setFormData({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
        images: item.images || []
      });
      setImageInputs([...(item.images || ['']), '']);
    } else {
      setFormData(item);
      if (item.images) {
        setImageInputs([...item.images, '']);
      }
    }
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      let result;
      
      if (activeTab === 'projects') {
        result = await supabase.from('Projects').delete().eq('id', id);
        if (!result.error) fetchProjects();
      } else if (activeTab === 'posts') {
        result = await supabase.from('blog_posts').delete().eq('id', id);
        if (!result.error) fetchBlogPosts();
      } else if (activeTab === 'categories') {
        result = await supabase.from('blog_categories').delete().eq('id', id);
        if (!result.error) fetchCategories();
      } else if (activeTab === 'tags') {
        result = await supabase.from('blog_tags').delete().eq('id', id);
        if (!result.error) fetchTags();
      } else if (activeTab === 'timeline') {
        result = await supabase.from('career_timeline').delete().eq('id', id);
        if (!result.error) fetchCareerTimeline();
      } else if (activeTab === 'skills') {
        result = await supabase.from('skills').delete().eq('id', id);
        if (!result.error) fetchSkills();
      } else if (activeTab === 'achievements') {
        result = await supabase.from('achievements').delete().eq('id', id);
        if (!result.error) fetchAchievements();
      } else if (activeTab === 'availability') {
        result = await supabase.from('availability_status').delete().eq('id', id);
        if (!result.error) fetchAvailabilityStatuses();
      }

      if (result?.error) {
        alert('Error: ' + result.error.message);
      } else {
        alert('Deleted successfully!');
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
    setImageInputs(['']);
  };

  const addImageInput = () => {
    setImageInputs([...imageInputs, '']);
  };

  const removeImageInput = (index: number) => {
    if (imageInputs.length > 1) {
      const newInputs = imageInputs.filter((_, i) => i !== index);
      setImageInputs(newInputs);
      const images = newInputs.filter(img => img.trim() !== '');
      setFormData(prev => ({ ...prev, images }));
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: '📊',
      description: 'Dashboard overview'
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: '🚀',
      count: projects.length,
      description: 'Manage portfolio projects'
    },
    { 
      id: 'posts', 
      name: 'Blog Posts', 
      icon: '📝',
      count: blogPosts.length,
      description: 'Create and edit blog content'
    },
    { 
      id: 'categories', 
      name: 'Categories', 
      icon: '📁',
      count: categories.length,
      description: 'Organize blog categories'
    },
    { 
      id: 'tags', 
      name: 'Tags', 
      icon: '🏷️',
      count: tags.length,
      description: 'Manage content tags'
    },
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: '👤',
      count: aboutProfile ? 1 : 0,
      description: 'Edit about page content'
    },
    { 
      id: 'timeline', 
      name: 'Timeline', 
      icon: '⏰',
      count: careerTimeline.length,
      description: 'Career timeline entries'
    },
    { 
      id: 'skills', 
      name: 'Skills', 
      icon: '⚡',
      count: skills.length,
      description: 'Technical skills & levels'
    },
    { 
      id: 'achievements', 
      name: 'Achievements', 
      icon: '🏆',
      count: achievements.length,
      description: 'Awards & milestones'
    },
    { 
      id: 'availability', 
      name: 'Availability', 
      icon: '🟢',
      count: availabilityStatuses.length,
      description: 'Current status & availability'
    },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="text-3xl mb-2">🚀</div>
          <div className="text-2xl font-bold text-cyan-400">{projects.length}</div>
          <div className="text-slate-400">Projects</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-purple-400">{blogPosts.length}</div>
          <div className="text-slate-400">Blog Posts</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-green-400">{skills.length}</div>
          <div className="text-slate-400">Skills</div>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-yellow-400">{achievements.length}</div>
          <div className="text-slate-400">Achievements</div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 gradient-text-royal">Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium">{project.title}</div>
                  <div className="text-sm text-slate-400">{project.status}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 gradient-text-royal">Recent Blog Posts</h3>
          <div className="space-y-3">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-slate-400">{post.status}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-4 gradient-text-royal">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlowButton 
            onClick={() => {
              setActiveTab('projects');
              setShowForm(true);
            }}
            className="flex items-center gap-2 justify-center"
          >
            🚀 Add Project
          </GlowButton>
          <GlowButton 
            onClick={() => {
              setActiveTab('posts');
              setShowForm(true);
            }}
            variant="outline"
            className="flex items-center gap-2 justify-center"
          >
            📝 Write Post
          </GlowButton>
          <GlowButton 
            onClick={() => {
              setActiveTab('availability');
              setShowForm(true);
            }}
            variant="outline"
            className="flex items-center gap-2 justify-center"
          >
            🟢 Update Status
          </GlowButton>
        </div>
      </GlassCard>
    </div>
  );

  const renderForm = () => {
    if (activeTab === 'projects') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status || 'Completed'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Long Description
            </label>
            <textarea
              name="long_description"
              value={formData.long_description || ''}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Detailed description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Web Design, UI/UX, Frontend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="React, TypeScript, Tailwind CSS"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Main Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Live URL
              </label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="https://project.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          {/* Multiple Images Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-300">
                Additional Images
              </label>
              <button
                type="button"
                onClick={addImageInput}
                className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                Add Image
              </button>
            </div>
            <div className="space-y-3">
              {imageInputs.map((imageUrl, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    name={`image_${index}`}
                    value={imageUrl}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder={`Image ${index + 1} URL`}
                  />
                  {imageInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageInput(index)}
                      className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Add multiple images to create a gallery for your project. The first image will be used as the main image.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </>
      );
    }

    if (activeTab === 'posts') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Brief excerpt for the post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              required
              rows={10}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Full post content (Markdown supported)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status || 'published'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Author Name
              </label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name || 'James Geiger'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Author Email
              </label>
              <input
                type="email"
                name="author_email"
                value={formData.author_email || 'james@example.com'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                name="featured_image"
                value={formData.featured_image || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Multiple Images Section for Blog Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-300">
                Additional Images
              </label>
              <button
                type="button"
                onClick={addImageInput}
                className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add Image
              </button>
            </div>
            <div className="space-y-3">
              {imageInputs.map((imageUrl, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    name={`image_${index}`}
                    value={imageUrl}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder={`Image ${index + 1} URL`}
                  />
                  {imageInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageInput(index)}
                      className="px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Add multiple images to enhance your blog post with visual content.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured || false}
                onChange={handleInputChange}
                className="rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500"
              />
              Featured Post
            </label>
          </div>
        </>
      );
    }

    if (activeTab === 'availability') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="">Select status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active || false}
                  onChange={handleInputChange}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                Set as Active Status
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message || ''}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Describe your current availability..."
            />
          </div>
        </>
      );
    }

    // Add other form types as needed
    return null;
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return renderOverview();
    }

    if (activeTab === 'projects') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold gradient-text-royal">Projects</h2>
            <GlowButton
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              Add Project <ArrowRightIcon />
            </GlowButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <GlassCard key={project.id} className="group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {project.images && project.images.length > 1 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-slate-400">
                            📸 {project.images.length} images
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'Completed' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {project.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <CalendarIcon />
                          {new Date(project.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-cyan-400"
                      >
                        <MenuIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 transition-colors text-red-400"
                      >
                        <XIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'availability') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold gradient-text-royal">Availability Status</h2>
            <GlowButton
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              Add Status <ArrowRightIcon />
            </GlowButton>
          </div>

          <div className="space-y-4">
            {availabilityStatuses.map((status) => (
              <GlassCard key={status.id} className="group">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status.status === 'Available' 
                            ? 'bg-green-500 animate-pulse' 
                            : status.status === 'Busy'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}></div>
                        <h3 className="text-xl font-bold">{status.status}</h3>
                        {status.is_active && (
                          <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mb-2">{status.message}</p>
                      <p className="text-slate-400 text-sm">
                        Created: {new Date(status.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(status)}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors text-cyan-400"
                      >
                        <MenuIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(status.id)}
                        className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-500/20 transition-colors text-red-400"
                      >
                        <XIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      );
    }

    // Placeholder for other tabs
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">
          {tabs.find(t => t.id === activeTab)?.name} management coming soon...
        </p>
      </div>
    );
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-royal leading-tight">
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Manage your portfolio content with ease. Everything you need in one beautiful interface.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-2">
            <div className="sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    resetForm();
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white shadow-lg'
                      : 'bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tab.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-sm opacity-70">{tab.description}</div>
                    </div>
                    {tab.count !== undefined && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-text-royal leading-tight">
                    {editingItem ? 'Edit' : 'Add New'} {tabs.find(t => t.id === activeTab)?.name.slice(0, -1)}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <XIcon />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderForm()}

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6 border-t border-slate-700/50">
                    <GlowButton
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                      <ArrowRightIcon />
                    </GlowButton>
                    <GlowButton
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </GlowButton>
                  </div>
                </form>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;