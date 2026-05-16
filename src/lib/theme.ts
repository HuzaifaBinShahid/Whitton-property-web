import { create } from 'zustand';

export type Theme = 'light' | 'dark';

type State = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const STORAGE_KEY = 'pm.theme';

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* localStorage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyClass(t: Theme): void {
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.style.colorScheme = t;
}

function persist(t: Theme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* localStorage unavailable */
  }
}

export const useTheme = create<State>((set, get) => {
  const initial = readInitial();
  if (typeof document !== 'undefined') applyClass(initial);
  return {
    theme: initial,
    toggle: () => {
      const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
      persist(next);
      applyClass(next);
      set({ theme: next });
    },
    setTheme: (next) => {
      persist(next);
      applyClass(next);
      set({ theme: next });
    },
  };
});
