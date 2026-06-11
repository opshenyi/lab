import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'sparklab-theme-mode';

const isThemeMode = (value: unknown): value is ThemeMode => (
  value === 'system' || value === 'light' || value === 'dark'
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

const applyTheme = (mode: ThemeMode, resolvedTheme = resolveTheme(mode)) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.style.colorScheme = resolvedTheme;
};

const initialMode = readStoredMode();
const initialResolvedTheme = resolveTheme(initialMode);

applyTheme(initialMode, initialResolvedTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  resolvedTheme: initialResolvedTheme,
  setMode: (mode) => {
    const resolvedTheme = resolveTheme(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode, resolvedTheme);
    set({ mode, resolvedTheme });
  },
}));

if (typeof window !== 'undefined') {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const syncSystemTheme = () => {
    const { mode } = useThemeStore.getState();
    if (mode !== 'system') return;
    const resolvedTheme = resolveTheme(mode);
    applyTheme(mode, resolvedTheme);
    useThemeStore.setState({ resolvedTheme });
  };

  media.addEventListener('change', syncSystemTheme);
}
