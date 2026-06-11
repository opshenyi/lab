import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore, type ThemeMode } from '../../stores/themeStore';
import './ThemeSwitcher.css';

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'system', label: '跟随系统' },
  { value: 'dark', label: '深色模式' },
  { value: 'light', label: '浅色模式' },
];

const SystemIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="12" rx="2.5" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.3 15.6A8.5 8.5 0 0 1 8.4 3.7 8.5 8.5 0 1 0 20.3 15.6Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const ThemeModeIcon: React.FC<{ mode: ThemeMode }> = ({ mode }) => {
  if (mode === 'dark') return <MoonIcon />;
  if (mode === 'light') return <SunIcon />;
  return <SystemIcon />;
};

export const ThemeSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);
  const activeOption = themeOptions.find(option => option.value === mode) ?? themeOptions[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div className="theme-switcher" ref={menuRef}>
      <button
        className="theme-trigger"
        type="button"
        aria-label={`主题模式：${activeOption.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="theme-trigger-icon"><ThemeModeIcon mode={activeOption.value} /></span>
        <span className="theme-trigger-label">{activeOption.label}</span>
        <svg className="theme-trigger-chevron" width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div className="theme-menu" role="menu" aria-label="选择主题模式">
          {themeOptions.map(option => {
            const selected = option.value === mode;
            return (
              <button
                key={option.value}
                className={`theme-menu-item ${selected ? 'theme-menu-item-active' : ''}`}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setMode(option.value);
                  setOpen(false);
                }}
              >
                <span className="theme-menu-icon"><ThemeModeIcon mode={option.value} /></span>
                <span>{option.label}</span>
                <span className="theme-menu-check">{selected && <CheckIcon />}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
