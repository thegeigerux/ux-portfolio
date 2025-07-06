import React, { useState } from 'react';
import { useEffect } from 'react';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { supabase } from '../lib/supabase';

interface AvailabilityStatus {
  id: string;
  status: string;
  message: string;
  is_active: boolean;
}

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus | null>(null);

  // Fetch current availability status
  useEffect(() => {
    async function fetchAvailabilityStatus() {
      try {
        const { data, error } = await supabase
          .from('availability_status')
          .select('*')
          .eq('is_active', true)
          .single();

        if (!error && data) {
          setAvailabilityStatus(data);
        }
      } catch (err) {
        console.error('Error fetching availability status:', err);
        // Fallback to default status
        setAvailabilityStatus({
          id: 'default',
          status: 'Available',
          message: 'I\'m currently accepting new freelance projects and collaborations. Let\'s discuss your needs and see how I can help bring your vision to life.',
          is_active: true
        });
      }
    }

    fetchAvailabilityStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <GithubIcon />,
      url: 'https://github.com/thegeigerux',
      color: 'hover:text-gray-400',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinIcon />,
      url: 'https://linkedin.com/in/thegeigerux',
      color: 'hover:text-blue-400',
    },
    {
      name: 'Instagram',
      icon: <InstagramIcon />,
      url: 'https://instagram.com/thegeigerux',
      color: 'hover:text-pink-400',
    },
  ];

  const contactInfo = [
    {
      icon: <MailIcon />,
      label: 'Email',
      value: 'thegeigerux@gmail.com',
      href: 'mailto:thegeigerux@gmail.com',
    },
    {
      icon: <MapPinIcon />,
      label: 'Location',
      value: 'Charlotte, NC',
      href: '#',
    },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-10 gradient-text-royal leading-tight">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            I'm always interested in hearing about new projects and opportunities to collaborate. 
            Let's discuss how we can work together to create something amazing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* Current Availability - Moved to Top */}
            <GlassCard className="mb-8">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4 gradient-text-royal leading-tight">
                  Current Availability
                </h3>
                {availabilityStatus && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${
                        availabilityStatus.status === 'Available' 
                          ? 'bg-green-500 animate-pulse' 
                          : availabilityStatus.status === 'Busy'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}></div>
                      <span className={`font-medium ${
                        availabilityStatus.status === 'Available' 
                          ? 'text-green-400' 
                          : availabilityStatus.status === 'Busy'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {availabilityStatus.status === 'Available' 
                          ? 'Available for new projects' 
                          : availabilityStatus.status === 'Busy'
                          ? 'Currently busy'
                          : 'Not available'
                        }
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {availabilityStatus.message}
                    </p>
                  </>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 gradient-text-royal leading-tight">
                  Send me a message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-colors resize-vertical"
                      placeholder="Tell me about your ideas..."
                    />
                  </div>
                  <GlowButton type="submit" className="flex items-center gap-2">
                    <SendIcon />
                    Send Message
                  </GlowButton>
                </form>
              </div>
            </GlassCard>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Information */}
            <GlassCard>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6 gradient-text-royal leading-tight">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors group"
                    >
                      {info.icon}
                      <div>
                        <p className="text-sm text-slate-400">{info.label}</p>
                        <p className="text-slate-300 group-hover:text-white transition-colors">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Social Media */}
            <GlassCard>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-6 gradient-text-royal leading-tight">
                  Connect with me
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all group ${social.color}`}
                    >
                      {social.icon}
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;