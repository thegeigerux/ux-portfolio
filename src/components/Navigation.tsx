import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from './SimpleIcons';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Track scroll position for dynamic styling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
    ...(user ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;
  const isScrolled = scrollY > 50;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 dark:bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' 
        : 'bg-black/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/IMG_2698.jpeg" 
              alt="James Geiger" 
              className="w-10 h-10 rounded-full object-cover btn-3d icon-glow transition-all duration-[1200ms] ease-out group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-cyan-400/20"
            />
            <span className="text-xl font-bold gradient-text-royal !leading-none !p-0 !m-0 transition-all duration-[800ms] ease-out group-hover:scale-[1.01]">
              James Geiger, M. Ed.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-[800ms] ease-out rounded-lg group overflow-hidden ${
                  isActive(item.path)
                    ? 'text-blue-400 dark:text-sky-400'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 dark:from-cyan-500/8 dark:via-purple-500/8 dark:to-pink-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-[1000ms] ease-out rounded-lg"></div>
                
                {/* Text with subtle scale on hover */}
                <span className="relative z-10 transition-transform duration-[700ms] ease-out group-hover:scale-[1.01]">
                  {item.name}
                </span>
                
                {/* Active state underline with animation */}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 rounded-full shadow-sm shadow-blue-500/20 dark:shadow-cyan-400/30"></div>
                )}
                
                {/* Hover underline effect for non-active items */}
                {!isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 rounded-full"></div>
                )}
              </Link>
            ))}
            {user && (
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-[800ms] ease-out rounded-lg"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-[800ms] ease-out icon-glow hover:scale-[1.03] active:scale-[0.99]"
            >
              <div className={`transition-transform duration-[800ms] ease-out ${isOpen ? 'rotate-45' : ''}`}>
                {isOpen ? <XIcon /> : <MenuIcon />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/5 animate-in slide-in-from-top-2 duration-[800ms] shadow-lg shadow-black/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-[700ms] ease-out group relative overflow-hidden ${
                  isActive(item.path)
                    ? 'text-blue-400 dark:text-sky-400 bg-white/5'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Mobile hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 dark:from-cyan-500/8 dark:via-purple-500/8 dark:to-pink-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms] ease-out rounded-lg"></div>
                
                <span className="relative z-10 transition-transform duration-[600ms] ease-out group-hover:translate-x-1">
                  {item.name}
                </span>
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-[700ms] ease-out w-full text-left"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;