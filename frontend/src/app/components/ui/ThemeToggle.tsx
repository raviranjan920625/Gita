'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light');
    setIsDark(!isLight);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add('light');
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        left: '1.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
      aria-label="Toggle Light/Dark Mode"
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
