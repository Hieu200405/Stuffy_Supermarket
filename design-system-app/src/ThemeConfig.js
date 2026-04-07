/**
 * DYNAMIC THEME CONFIGURATOR (SHARED DESIGN SYSTEM)
 * Objective: Control global aesthetics from a single source of truth.
 */

const themes = {
  default: {
    '--primary-color': '#6366f1',
    '--primary-dark': '#4f46e5',
    '--secondary-color': '#ec4899',
    '--bg-main': '#f8fafc',
    '--card-bg': 'rgba(255, 255, 255, 0.7)',
    '--text-main': '#0f172a',
    '--text-muted': '#64748b',
    '--border-light': '#e2e8f0',
    '--radius-standard': '16px'
  },
  emerald: {
    '--primary-color': '#10b981',
    '--primary-dark': '#059669',
    '--secondary-color': '#f59e0b',
    '--bg-main': '#f0fdf4',
    '--card-bg': 'rgba(255, 255, 255, 0.8)',
    '--text-main': '#064e3b',
    '--text-muted': '#365314',
    '--border-light': '#dcfce7',
    '--radius-standard': '24px'
  },
  midnight: {
    '--primary-color': '#a855f7',
    '--primary-dark': '#7e22ce',
    '--secondary-color': '#3b82f6',
    '--bg-main': '#020617',
    '--card-bg': 'rgba(30, 41, 59, 0.7)',
    '--text-main': '#f8fafc',
    '--text-muted': '#94a3b8',
    '--border-light': '#1e293b',
    '--radius-standard': '12px'
  }
};

export const applyTheme = (themeName = 'default') => {
  const theme = themes[themeName] || themes.default;
  const root = document.documentElement;
  
  console.log(`[DesignSystem] 🎨 Switching to theme: ${themeName}`);
  
  Object.keys(theme).forEach(property => {
    root.style.setProperty(property, theme[property]);
  });

  // Persistent user preference
  localStorage.setItem('STUFFY_THEME', themeName);
};

// Initialize on Load
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('STUFFY_THEME') || 'default';
    applyTheme(saved);
}
