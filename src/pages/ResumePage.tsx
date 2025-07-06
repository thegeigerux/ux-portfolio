import React from 'react';
import { DownloadIcon, MapPinIcon, MailIcon, PhoneIcon, CalendarIcon, AwardIcon, BuildingIcon, GraduationCapIcon } from '../components/SimpleIcons';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const ResumePage = () => {
  const experience = [
    {
      company: 'TechCorp Inc.',
      position: 'Senior UI/UX Designer',
      duration: '2022 - Present',
      location: 'San Francisco, CA',
      description: [
        'Led design initiatives for 3 major product launches, resulting in 40% increase in user engagement',
        'Collaborated with cross-functional teams to deliver pixel-perfect designs within tight deadlines',
        'Established and maintained design system used across 5 different product lines',
        'Mentored junior designers and conducted design reviews for quality assurance',
      ],
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Designer & Developer',
      duration: '2020 - 2022',
      location: 'Remote',
      description: [
        'Designed and developed responsive web applications using React and TypeScript',
        'Reduced page load times by 60% through optimization and performance improvements',
        'Implemented accessibility standards achieving WCAG 2.1 AA compliance',
        'Worked closely with product managers to translate requirements into user-friendly interfaces',
      ],
    },
    {
      company: 'Creative Agency',
      position: 'Junior Web Designer',
      duration: '2019 - 2020',
      location: 'New York, NY',
      description: [
        'Created visual designs for client websites and marketing materials',
        'Collaborated with developers to ensure design feasibility and implementation',
        'Participated in client meetings and presentation of design concepts',
        'Maintained brand consistency across multiple client projects',
      ],
    },
  ];

  const education = [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Arts in Visual Design',
      duration: '2015 - 2019',
      details: 'Magna Cum Laude, Design Society President',
    },
    {
      institution: 'Stanford Continuing Studies',
      degree: 'Certificate in Human-Computer Interaction',
      duration: '2021',
      details: 'Specialized in user research and interaction design',
    },
  ];

  const skills = {
    design: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Framer', 'Principle'],
    development: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
    tools: ['Git', 'Jira', 'Notion', 'Miro', 'Slack'],
    soft: ['Team Leadership', 'Project Management', 'User Research', 'Stakeholder Communication'],
  };

  const certifications = [
    {
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      year: '2023',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2022',
    },
    {
      name: 'Certified Scrum Master',
      issuer: 'Scrum Alliance',
      year: '2021',
    },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-10 gradient-text-royal leading-tight">
            Resume
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            A comprehensive overview of my professional experience, skills, and qualifications.
          </p>
          <GlowButton className="flex items-center gap-2 mx-auto">
            <DownloadIcon />
            Download PDF Resume
          </GlowButton>
        </div>

        {/* Contact Information */}
        <GlassCard className="mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">AD</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">Alex Designer</h2>
                <p className="text-xl text-slate-300 mb-4">Senior UI/UX Designer & Frontend Developer</p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPinIcon />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon />
                    <span>alex@designer.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Professional Summary */}
        <GlassCard className="mb-8">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4 gradient-text-royal leading-tight">
              Professional Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Passionate UI/UX Designer and Frontend Developer with 5+ years of experience creating 
              exceptional digital experiences. Proven track record of leading design initiatives that 
              increase user engagement and drive business results. Skilled in both design and development, 
              with expertise in modern frameworks and design systems. Strong collaborator who thrives in 
              fast-paced environments and enjoys mentoring junior team members.
            </p>
          </div>
        </GlassCard>

        {/* Experience */}
        <GlassCard className="mb-8">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 gradient-text-royal leading-tight">
              Professional Experience
            </h3>
            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="border-l-2 border-gradient-to-b from-cyan-500 to-purple-500 pl-6 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <h4 className="text-xl font-bold">{job.position}</h4>
                      <div className="flex items-center gap-2 text-slate-300">
                        <BuildingIcon />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon />
                        {job.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  <ul className="text-slate-300 space-y-2 mt-4">
                    {job.description.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Education */}
        <GlassCard className="mb-8">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 gradient-text-royal leading-tight">
              Education
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <GraduationCapIcon />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{edu.degree}</h4>
                    <p className="text-slate-300">{edu.institution}</p>
                    <div className="flex items-center gap-4 text-slate-400 text-sm mt-1">
                      <span>{edu.duration}</span>
                      <span>{edu.details}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Skills */}
        <GlassCard className="mb-8">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 gradient-text-royal leading-tight">
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold mb-3 text-cyan-400">Design Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.design.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-3 text-purple-400">Development</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.development.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-3 text-pink-400">Tools & Workflow</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-3 text-orange-400">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Certifications */}
        <GlassCard className="mb-8">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 gradient-text-royal leading-tight">
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
                    <AwardIcon />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{cert.name}</h4>
                    <p className="text-slate-300">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Download CTA */}
        <div className="text-center">
          <GlassCard className="max-w-md mx-auto">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 gradient-text-royal leading-tight">
                Download Full Resume
              </h3>
              <p className="text-slate-300 mb-6 text-sm">
                Get a PDF version of my complete resume for your records.
              </p>
              <GlowButton className="flex items-center gap-2 mx-auto">
                <DownloadIcon />
                Download PDF
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;