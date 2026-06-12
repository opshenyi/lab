import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export type ThemeTransitionOrigin = { x: number; y: number };
export type ColorTheme =
  | 'graphite'
  | 'harbor'
  | 'indigo'
  | 'wisteria'
  | 'rosewood'
  | 'terracotta'
  | 'amber'
  | 'custom';

export const colorThemeOptions: Array<{
  value: ColorTheme;
  label: string;
  swatches: [string, string, string];
}> = [
  { value: 'graphite', label: '石墨灰', swatches: ['#5b6170', '#8b8f98', '#f1f2f3'] },
  { value: 'harbor', label: '海湾蓝', swatches: ['#526d7a', '#88a0aa', '#edf3f5'] },
  { value: 'indigo', label: '靛青', swatches: ['#5c6398', '#9298ca', '#f0f1f8'] },
  { value: 'wisteria', label: '紫藤', swatches: ['#746087', '#a898b8', '#f3eff6'] },
  { value: 'rosewood', label: '檀木红', swatches: ['#875a64', '#ba929a', '#f7eff1'] },
  { value: 'terracotta', label: '陶土', swatches: ['#8a624f', '#bc9988', '#f7f1ed'] },
  { value: 'amber', label: '琥珀', swatches: ['#7c6d4a', '#b4a47d', '#f5f1e6'] },
  { value: 'custom', label: '自定义', swatches: ['#5b6170', '#8b8f98', '#f1f2f3'] },
];

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  colorTheme: ColorTheme;
  customColor: string;
  setMode: (mode: ThemeMode, origin?: ThemeTransitionOrigin) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setCustomColor: (color: string) => void;
}

const STORAGE_KEY = 'sparklab-theme-mode';
const COLOR_STORAGE_KEY = 'sparklab-color-theme';
const CUSTOM_COLOR_STORAGE_KEY = 'sparklab-custom-color';
const DEFAULT_CUSTOM_COLOR = '#5b6170';
const THEME_TRANSITION_CLASS = 'theme-transitioning';
let themeTransitionId = 0;
let themeTransitionCleanupTimer: number | null = null;

type ThemeViewTransition = {
  finished: Promise<void>;
};

type ThemeViewTransitionStarter = {
  startViewTransition?: (callback: () => void) => ThemeViewTransition;
};

const isThemeMode = (value: unknown): value is ThemeMode => (
  value === 'system' || value === 'light' || value === 'dark'
);

const isColorTheme = (value: unknown): value is ColorTheme => (
  colorThemeOptions.some(option => option.value === value)
);

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (mode: ThemeMode): ResolvedTheme => (
  mode === 'system' ? getSystemTheme() : mode
);

const readStoredMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeMode(stored) ? stored : 'system';
};

const readStoredColorTheme = (): ColorTheme => {
  if (typeof window === 'undefined') return 'graphite';
  const stored = window.localStorage.getItem(COLOR_STORAGE_KEY);
  return isColorTheme(stored) ? stored : 'graphite';
};

const normalizeHexColor = (value: unknown) => {
  if (typeof value !== 'string') return DEFAULT_CUSTOM_COLOR;
  const color = value.trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : DEFAULT_CUSTOM_COLOR;
};

const readStoredCustomColor = () => {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_COLOR;
  return normalizeHexColor(window.localStorage.getItem(CUSTOM_COLOR_STORAGE_KEY));
};

const hexToRgb = (color: string) => {
  const normalized = normalizeHexColor(color).slice(1);
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
};

const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0');

const mixColor = (color: string, target: '#000000' | '#ffffff', amount: number) => {
  const source = hexToRgb(color);
  const targetRgb = hexToRgb(target);
  return `#${toHex(source.r + (targetRgb.r - source.r) * amount)}${toHex(source.g + (targetRgb.g - source.g) * amount)}${toHex(source.b + (targetRgb.b - source.b) * amount)}`;
};

const getContrastColor = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? '#1a1b1a' : '#ffffff';
};

const applyTheme = (mode: ThemeMode, resolvedTheme = resolveTheme(mode)) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.style.colorScheme = resolvedTheme;
};

const applyCustomColorTokens = (color: string) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const { r, g, b } = hexToRgb(color);
  const hoverTarget = root.dataset.theme === 'dark' ? '#ffffff' : '#000000';

  root.style.setProperty('--custom-accent', color);
  root.style.setProperty('--custom-accent-hover', mixColor(color, hoverTarget, 0.16));
  root.style.setProperty('--custom-accent-active', mixColor(color, hoverTarget, 0.28));
  root.style.setProperty('--custom-accent-contrast', getContrastColor(color));
  root.style.setProperty('--custom-accent-neutral', `rgba(${r},${g},${b},0.12)`);
  root.style.setProperty('--custom-accent-neutral-hover', `rgba(${r},${g},${b},0.18)`);
  root.style.setProperty('--custom-accent-muted', `rgba(${r},${g},${b},0.14)`);
  root.style.setProperty('--custom-focus-ring', `rgba(${r},${g},${b},0.28)`);
  root.style.setProperty('--custom-selection', `rgba(${r},${g},${b},0.18)`);
};

const applyColorTheme = (theme: ColorTheme, customColor = readStoredCustomColor()) => {
  if (typeof document === 'undefined') return;
  applyCustomColorTokens(customColor);
  document.documentElement.dataset.colorTheme = theme;
};

const setThemeTransitionGeometry = (origin?: ThemeTransitionOrigin) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.ceil(Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  ));

  document.documentElement.style.setProperty('--theme-transition-x', `${x}px`);
  document.documentElement.style.setProperty('--theme-transition-y', `${y}px`);
  document.documentElement.style.setProperty('--theme-transition-radius', `${radius}px`);
};

const updateThemeWithTransition = (
  mode: ThemeMode,
  resolvedTheme: ResolvedTheme,
  origin?: ThemeTransitionOrigin,
  colorTheme = readStoredColorTheme(),
  customColor = readStoredCustomColor(),
) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const viewTransitionDocument = document as unknown as ThemeViewTransitionStarter;

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyTheme(mode, resolvedTheme);
    applyColorTheme(colorTheme, customColor);
    return;
  }

  setThemeTransitionGeometry(origin);
  themeTransitionId += 1;
  const currentTransitionId = themeTransitionId;

  if (themeTransitionCleanupTimer !== null) {
    window.clearTimeout(themeTransitionCleanupTimer);
    themeTransitionCleanupTimer = null;
  }

  root.classList.add(THEME_TRANSITION_CLASS);

  const finish = () => {
    if (currentTransitionId !== themeTransitionId) return;

    themeTransitionCleanupTimer = window.setTimeout(() => {
      if (currentTransitionId !== themeTransitionId) return;
      root.classList.remove(THEME_TRANSITION_CLASS);
      themeTransitionCleanupTimer = null;
    }, 80);
  };

  if (typeof viewTransitionDocument.startViewTransition === 'function') {
    const transition = viewTransitionDocument.startViewTransition(() => {
      applyTheme(mode, resolvedTheme);
      applyColorTheme(colorTheme, customColor);
    });
    transition.finished.finally(finish);
    return;
  }

  window.requestAnimationFrame(() => {
    applyTheme(mode, resolvedTheme);
    applyColorTheme(colorTheme, customColor);
    finish();
  });
};

const initialMode = readStoredMode();
const initialResolvedTheme = resolveTheme(initialMode);
const initialColorTheme = readStoredColorTheme();
const initialCustomColor = readStoredCustomColor();

applyTheme(initialMode, initialResolvedTheme);
applyColorTheme(initialColorTheme, initialCustomColor);

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  resolvedTheme: initialResolvedTheme,
  colorTheme: initialColorTheme,
  customColor: initialCustomColor,
  setMode: (mode, origin) => {
    const resolvedTheme = resolveTheme(mode);
    const { colorTheme, customColor } = useThemeStore.getState();
    window.localStorage.setItem(STORAGE_KEY, mode);
    updateThemeWithTransition(mode, resolvedTheme, origin, colorTheme, customColor);
    set({ mode, resolvedTheme });
  },
  setColorTheme: (colorTheme) => {
    const { customColor } = useThemeStore.getState();
    window.localStorage.setItem(COLOR_STORAGE_KEY, colorTheme);
    applyColorTheme(colorTheme, customColor);
    set({ colorTheme });
  },
  setCustomColor: (color) => {
    const customColor = normalizeHexColor(color);
    window.localStorage.setItem(CUSTOM_COLOR_STORAGE_KEY, customColor);
    window.localStorage.setItem(COLOR_STORAGE_KEY, 'custom');
    applyColorTheme('custom', customColor);
    set({ colorTheme: 'custom', customColor });
  },
}));

if (typeof window !== 'undefined') {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const syncSystemTheme = () => {
    const { mode } = useThemeStore.getState();
    if (mode !== 'system') return;
    const resolvedTheme = resolveTheme(mode);
    const { colorTheme, customColor } = useThemeStore.getState();
    updateThemeWithTransition(mode, resolvedTheme, undefined, colorTheme, customColor);
    useThemeStore.setState({ resolvedTheme });
  };

  media.addEventListener('change', syncSystemTheme);
}
