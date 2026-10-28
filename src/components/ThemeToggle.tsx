import {MoonIcon, SunIcon} from '@heroicons/react/24/outline';
import {FC, memo, useEffect, useState} from 'react';

/** Fired on <html> whenever the theme flips, so canvas drawings can repaint. */
export const THEME_EVENT = 'themechange';

export type Appearance = 'system' | 'light' | 'dark';

/** The visitor's own choice, remembered across pages and themes. */
const STORAGE_KEY = 'theme';

export const isLight = () => document.documentElement.classList.contains('light');

/** Sets html.light or html.dark (exactly one) and tells listeners. */
const apply = (light: boolean) => {
  const {classList} = document.documentElement;
  classList.toggle('light', light);
  classList.toggle('dark', !light);
  document.documentElement.dispatchEvent(new Event(THEME_EVENT));
};

/**
 * Runs before first paint (see _document): the visitor's remembered choice, else the page's
 * `appearance` meta tag from resume.yaml, where "system" follows the device. Also puts the
 * page theme's class (theme-class meta) on <html> early, so its colours apply from the start.
 */
export const appearanceScript = `try{var a=null;try{a=localStorage.getItem('${STORAGE_KEY}')}catch(e){}if(a!=='light'&&a!=='dark'){var m=document.querySelector('meta[name="appearance"]');a=m?m.content:'system'}if(a==='system')a=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var c=document.documentElement.classList;c.toggle('light',a==='light');c.toggle('dark',a!=='light');var t=document.querySelector('meta[name="theme-class"]');if(t)c.add(t.content)}catch(e){}`;

/** Re-applies the appearance after moving between pages in the browser (the script only runs on load). */
export const useAppearance = (fallback: Appearance) => {
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage blocked (private mode): use the page's default
    }
    const choice = stored === 'light' || stored === 'dark' ? stored : fallback;
    apply(choice === 'system' ? window.matchMedia('(prefers-color-scheme: light)').matches : choice === 'light');
  }, [fallback]);
};

/** Flip the theme, remember it, and tell listeners (the toggle buttons, the particle canvas). */
export const toggleTheme = () => {
  const next = !isLight();
  apply(next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark');
  } catch {
    // storage blocked (private mode) — the switch still works for this visit
  }
};

/** Whether the page is light right now, following every toggle. */
export const useIsLight = () => {
  const [light, setLight] = useState(false);

  // the hero terminal's `theme` command can flip it too, so follow the event
  useEffect(() => {
    const sync = () => setLight(isLight());
    sync();
    document.documentElement.addEventListener(THEME_EVENT, sync);
    return () => document.documentElement.removeEventListener(THEME_EVENT, sync);
  }, []);

  return light;
};

interface ThemeToggleProps {
  /** Replaces the terminal theme's glass button styles. */
  className?: string;
  iconClassName?: string;
}

/** Light / dark switch, styled for the terminal theme unless a className is given. */
const ThemeToggle: FC<ThemeToggleProps> = memo(({className, iconClassName = 'h-5 w-5'}) => {
  const light = useIsLight();

  return (
    <button
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={light}
      className={className ?? 'glass grid h-10 w-10 place-items-center !rounded-xl text-slate-200 hover:text-lime'}
      onClick={toggleTheme}
      type="button">
      {light ? <MoonIcon className={iconClassName} /> : <SunIcon className={iconClassName} />}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
export default ThemeToggle;
