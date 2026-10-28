import {MoonIcon, SunIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {FC, memo, useEffect, useState} from 'react';

/** Fired on <html> whenever the theme flips, so canvas drawings can repaint. */
export const THEME_EVENT = 'themechange';

export const isLight = () => document.documentElement.classList.contains('light');

/** Flip the theme, remember it, and tell listeners (the toggle button, the particle canvas). */
export const toggleTheme = () => {
  const next = !isLight();
  document.documentElement.classList.toggle('light', next);
  try {
    localStorage.setItem('theme', next ? 'light' : 'dark');
  } catch {
    // storage blocked (private mode) — the switch still works for this visit
  }
  document.documentElement.dispatchEvent(new Event(THEME_EVENT));
};

/**
 * Light / dark switch. Dark is the default; the choice is remembered in
 * localStorage and applied before first paint by the inline script in _document.
 */
const ThemeToggle: FC<{className?: string}> = memo(({className}) => {
  const [light, setLight] = useState(false);

  // the hero terminal's `theme` command can flip it too, so follow the event
  useEffect(() => {
    const sync = () => setLight(isLight());
    sync();
    document.documentElement.addEventListener(THEME_EVENT, sync);
    return () => document.documentElement.removeEventListener(THEME_EVENT, sync);
  }, []);

  return (
    <button
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={light}
      className={classNames(
        'glass grid h-10 w-10 place-items-center !rounded-xl text-slate-200 hover:text-lime',
        className,
      )}
      onClick={toggleTheme}
      type="button">
      {light ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
export default ThemeToggle;
