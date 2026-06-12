import React, { useEffect, useRef, useState } from 'react';
import { colorThemeOptions, useThemeStore, type ColorTheme } from '../stores/themeStore';
import './DesktopWindowControls.css';

const MinimizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2 6.5h8" />
  </svg>
);

const MaximizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <rect x="2.5" y="2.5" width="7" height="7" rx="1.2" />
  </svg>
);

const RestoreIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M4.2 2.4h5.4v5.4" />
    <rect x="2.4" y="4.2" width="5.4" height="5.4" rx="1.1" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="m3 3 6 6" />
    <path d="m9 3-6 6" />
  </svg>
);

const PaletteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M6.5 1.2a5.3 5.3 0 0 0 0 10.6h.8c.54 0 .98-.44.98-.98 0-.25-.1-.5-.27-.68-.18-.2-.28-.45-.28-.71 0-.58.47-1.05 1.05-1.05h.43A2.59 2.59 0 0 0 11.8 5.8c0-2.54-2.37-4.6-5.3-4.6Z" />
    <path d="M4.1 5.25h.01" />
    <path d="M5.75 3.65h.01" />
    <path d="M8.05 3.95h.01" />
    <path d="M3.9 7.45h.01" />
  </svg>
);

const CustomColorIcon = () => (
  <span className="desktop-theme-custom-icon" aria-hidden="true">
    <span className="desktop-theme-custom-icon-canvas" />
    <svg className="desktop-theme-custom-icon-pencil" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="m11.45 3.65 2.9 2.9" />
      <path d="M4.4 13.6 3.8 16l2.4-.6 8-8a2.05 2.05 0 0 0-2.9-2.9z" />
      <path d="M3.8 16h6.1" />
    </svg>
    <svg className="desktop-theme-custom-icon-plus" width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 2.2v5.6" />
      <path d="M2.2 5h5.6" />
    </svg>
  </span>
);

const getOptionSwatches = (theme: ColorTheme, customColor: string) => {
  const option = colorThemeOptions.find(item => item.value === theme) ?? colorThemeOptions[0];
  return theme === 'custom'
    ? [customColor, customColor, 'var(--canvas-neutral)']
    : option.swatches;
};

export const DesktopWindowControls: React.FC = () => {
  const isDesktop = Boolean(window.sparkLabDesktop?.isDesktop);
  const [isMaximized, setIsMaximized] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [customEditorOpen, setCustomEditorOpen] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);
  const customColorInputRef = useRef<HTMLInputElement>(null);
  const colorTheme = useThemeStore(state => state.colorTheme);
  const customColor = useThemeStore(state => state.customColor);
  const setColorTheme = useThemeStore(state => state.setColorTheme);
  const setCustomColor = useThemeStore(state => state.setCustomColor);
  const activeColorTheme = colorThemeOptions.find(option => option.value === colorTheme) ?? colorThemeOptions[0];

  useEffect(() => {
    if (!isDesktop) return;

    document.documentElement.dataset.sparklabDesktop = 'true';
    return () => {
      delete document.documentElement.dataset.sparklabDesktop;
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    return window.sparkLabDesktop?.onWindowState(state => {
      setIsMaximized(state.isMaximized || state.isFullScreen);
    });
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!themePickerRef.current?.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <div className="desktop-window-titlebar-surface" aria-hidden="true" />
      <div className="desktop-window-drag-region" aria-hidden="true" />
      <div className="desktop-window-controls" aria-label="窗口控制">
        <div className="desktop-theme-picker" ref={themePickerRef}>
          <button
            className="desktop-theme-trigger"
            type="button"
            aria-label={'主题配色：' + activeColorTheme.label}
            aria-haspopup="menu"
            aria-expanded={themeMenuOpen}
            onClick={() => setThemeMenuOpen(open => !open)}
          >
            <PaletteIcon />
          </button>

          {themeMenuOpen && (
            <div className="desktop-theme-menu" role="menu" aria-label="主题配色">
              {colorThemeOptions.map(option => {
                const selected = option.value === colorTheme;
                const swatches = getOptionSwatches(option.value, customColor);
                return (
                  <button
                    key={option.value}
                    className={`desktop-theme-option ${option.value === 'custom' ? 'desktop-theme-option-custom' : ''} ${selected ? 'desktop-theme-option-active' : ''}`}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => {
                      if (option.value === 'custom') {
                        setColorTheme('custom');
                        setCustomEditorOpen(true);
                        window.setTimeout(() => customColorInputRef.current?.click(), 0);
                        return;
                      }

                      setColorTheme(option.value);
                      setCustomEditorOpen(false);
                      setThemeMenuOpen(false);
                    }}
                  >
                    {option.value === 'custom' ? (
                      <CustomColorIcon />
                    ) : (
                      <span className="desktop-theme-option-swatches" aria-hidden="true">
                        {swatches.map((color, index) => (
                          <span key={`${option.value}-${index}`} style={{ '--desktop-theme-swatch': color } as React.CSSProperties} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}

              {customEditorOpen && (
                <div className="desktop-theme-custom-panel">
                  <input
                    ref={customColorInputRef}
                    type="color"
                    value={customColor}
                    aria-label="自定义颜色"
                    onChange={event => setCustomColor(event.currentTarget.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <button type="button" aria-label="最小化" onClick={() => window.sparkLabDesktop?.minimize()}>
          <MinimizeIcon />
        </button>
        <button type="button" aria-label={isMaximized ? '还原' : '最大化'} onClick={() => window.sparkLabDesktop?.toggleMaximize()}>
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>
        <button className="desktop-window-close" type="button" aria-label="关闭" onClick={() => window.sparkLabDesktop?.close()}>
          <CloseIcon />
        </button>
      </div>
    </>
  );
};
