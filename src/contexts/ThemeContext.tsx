import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark mode for SSR
  };
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
      }
    } catch (error) {
      console.log('Theme initialization error:', error);
      setIsDark(true); // Default to dark mode
    }
  }, []);

  useEffect(() => {
    // Apply theme to document root
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  const toggleTheme = () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Theme toggle error:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};