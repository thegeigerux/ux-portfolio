import React, { useState, useEffect } from 'react';
import { DownloadIcon, MapPinIcon, CalendarIcon, AwardIcon, UsersIcon, CoffeeIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { supabase } from '../lib/supabase';

interface AboutProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  profile_image: string;
  resume_url: string;
}

interface CareerTimelineItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  icon: string;
  order_index: number;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  order_index: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  icon: string;
  order_index: number;
}

const AboutPage = () => {
  const [activeSkillFilter, setActiveSkillFilter] = useState('All');
  const [aboutProfile, setAboutProfile] = useState<AboutProfile | null>(null);
  const [careerTimeline, setCareerTimeline] = useState<CareerTimelineItem[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchAboutData() {
      try {
        setLoading(true);

        // Fetch profile
        const { data: profileData } = await supabase
          .from('about_profile')
          .select('*')
          .single();

        if (profileData) {
          setAboutProfile(profileData);
        }

        // Fetch career timeline
        const { data: timelineData } = await supabase
          .from('career_timeline')
          .select('*')
          .order('order_index');

        if (timelineData) {
          setCareerTimeline(timelineData);
        }

        // Fetch skills
        const { data: skillsData } = await supabase
          .from('skills')
          .select('*')
          .order('order_index');

        if (skillsData) {
          setSkills(skillsData);
        }

        // Fetch achievements
        const { data: achievementsData } = await supabase
          .from('achievements')
          .select('*')
          .order('order_index');

        if (achievementsData) {
          setAchievements(achievementsData);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  const skillFilters = ['All', 'Design', 'Frontend', 'Backend', 'Tools'];

  const filteredSkills = activeSkillFilter === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeSkillFilter);

  const getSkillColor = (level: number) => {
    if (level >= 70) return 'from-blue-500 to-cyan-400';
    if (level >= 40) return 'from-purple-500 to-blue-400';
    return 'from-gray-500 to-gray-400';
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-slate-300">Loading about page content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Profile Photo */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-200">
                <img 
                  src={aboutProfile?.profile_image || '/IMG_2698.jpeg'} 
                  alt={aboutProfile?.name || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse"></div>
          </div>
        </div>

        {/* Two Column Layout - About Me & Career Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - About Me */}
          <div className="flex flex-col text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-royal leading-tight">
              About Me
            </h1>
            
            <div className="space-y-6 text-slate-300 leading-relaxed">
              {aboutProfile?.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              )) || (
                <p className="text-lg">
                  Hello! I'm James, a passionate full-stack developer with over 5 years of experience 
                  building modern web applications. I specialize in React, Next.js, and Firebase, 
                  focusing on creating intuitive and performant user experiences.
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <a 
                href={aboutProfile?.resume_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <GlowButton className="flex items-center gap-2">
                  <DownloadIcon />
                  Download Resume
                </GlowButton>
              </a>
            </div>
          </div>

          {/* Right Side - Career Timeline */}
          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text-royal leading-tight text-center lg:text-left">Career Timeline</h2>
            <div className="space-y-8">
              {careerTimeline.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline line */}
                  {index !== careerTimeline.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-cyan-400 to-purple-500"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                      <h3 className="text-xl font-bold text-cyan-400 mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 mb-3">
                        <span className="font-medium">{item.company}</span>
                        <span>•</span>
                        <span>{item.period}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills & Expertise Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text-royal leading-tight">Skills & Expertise</h2>
            <p className="text-slate-300 max-w-3xl mx-auto">
              I've worked with various technologies across the full stack development spectrum. 
              Here's a breakdown of my technical skills and expertise.
            </p>
          </div>

          {/* Skill Filters */}
          <div className="flex justify-center gap-4 mb-12">
            {skillFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveSkillFilter(filter)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSkillFilter === filter
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div 
                key={skill.id} 
                className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                  <span className="text-cyan-400 font-bold">{skill.level}%</span>
                </div>
                
                <div className="mb-2">
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
                
                <span className="text-sm text-slate-400 capitalize">{skill.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold mb-8 text-center gradient-text-royal leading-tight">
            Achievements & Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <GlassCard key={achievement.id} className="text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
                <div className="p-6">
                  <div className="flex justify-center mb-4 text-cyan-400 text-4xl">
                    {achievement.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-white">{achievement.title}</h4>
                  <p className="text-slate-300 mb-3">{achievement.description}</p>
                  <span className="text-sm text-cyan-400">{achievement.year}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <GlassCard className="max-w-2xl mx-auto bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text-royal leading-tight">
                Let's Create Something Amazing
              </h3>
              <p className="text-slate-300 mb-6">
                I'm always interested in hearing about new projects and opportunities to collaborate.
              </p>
              <GlowButton>
                Get In Touch
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;