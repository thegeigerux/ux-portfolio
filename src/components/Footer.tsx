import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, LinkedinIcon } from './SimpleIcons';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Name and tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold gradient-text-royal !leading-none !p-0 !m-0 mb-2">
              James Geiger, M. Ed.
            </h3>
            <p className="text-slate-400 text-sm">
              Product Designer • Accessibility Advocate • AI Innovation
            </p>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/thegeigerux"
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-[800ms] ease-out hover:scale-[1.1] active:scale-[0.95] drop-shadow-sm hover:drop-shadow-md"
              aria-label="Follow on Instagram"
            >
              <div className="text-slate-400 group-hover:text-pink-400 transition-colors duration-500 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_8px_rgba(236,72,153,0.3)]">
                <InstagramIcon />
              </div>
            </a>
            <a
              href="https://linkedin.com/in/thegeigerux"
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-[800ms] ease-out hover:scale-[1.1] active:scale-[0.95] drop-shadow-sm hover:drop-shadow-md"
              aria-label="Connect on LinkedIn"
            >
              <div className="text-slate-400 group-hover:text-blue-400 transition-colors duration-500 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]">
                <LinkedinIcon />
              </div>
            </a>
          </div>
        </div>

        {/* Bottom section - Copyright */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            <Link 
              to="/login" 
              className="hover:text-slate-400 transition-colors duration-300"
            >
              © {new Date().getFullYear()} James Geiger. All rights reserved.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;