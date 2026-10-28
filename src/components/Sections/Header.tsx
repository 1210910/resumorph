import {Dialog, Transition} from '@headlessui/react';
import {Bars3Icon, EnvelopeIcon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import {Fragment, memo, useCallback, useEffect, useRef, useState} from 'react';

import {contact, profile, SectionId, socialLinks} from '../../data/data';
import {ContactType} from '../../data/dataDef';
import {useNavObserver} from '../../hooks/useNavObserver';
import Logo from '../Logo';
import ProtectedContact from '../ProtectedContact';
import Spotlit from '../Spotlit';
import ThemeToggle from '../ThemeToggle';

export const headerID = 'headerNav';

// nav items: every section except the hero
const navSections = [
  SectionId.Now,
  SectionId.About,
  SectionId.Resume,
  SectionId.References,
  SectionId.Portfolio,
  SectionId.Contact,
];

const ctaHref = '#contact';
const emailItem = contact.items.find(item => item.type === ContactType.Email);

const navLabel = (section: SectionId) => section.charAt(0).toUpperCase() + section.slice(1);

/** Monogram mark — solid signal, the one loud square on the bar. */
const BrandMark: React.FC<{className?: string}> = memo(({className}) => (
  <Logo
    className={classNames('brand-mark pointer-events-auto h-9 w-9 flex-none motion-reduce:transition-none', className)}
  />
));

/** Solid lime CTA pill — the single action on the right of the bar. */
const CtaLink: React.FC<{className?: string; iconClassName?: string}> = memo(({className, iconClassName}) => (
  <a
    className={classNames(
      'group pointer-events-auto flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink-950 shadow-glow transition-all duration-300 hover:bg-lime-bright hover:shadow-glow-lg active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100',
      className,
    )}
    href={ctaHref}>
    <EnvelopeIcon
      className={classNames(
        'h-4 w-4 opacity-80 transition-transform duration-300 motion-reduce:transition-none',
        iconClassName,
      )}
    />
    Let&apos;s talk
  </a>
));

const [firstName, ...lastNameParts] = profile.name.split(' ');
const lastName = lastNameParts.join(' ');
const Header = memo(() => {
  const [isOpen, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<SectionId | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // progress bar mutates its own width — no React state, no re-renders while scrolling
  const progressRef = useRef<HTMLSpanElement>(null);

  // the drawer closes from four places — one stable callback, not four fresh closures
  const closeDrawer = useCallback(() => setOpen(false), []);

  const intersectionHandler = (section: SectionId | null) => {
    if (section) setCurrent(section);
  };

  // intensify the bar once scrolled away from the top; keep the progress bar in sync (rAF-throttled)
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll, {passive: true});
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // lock page scroll while the mobile drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useNavObserver(navSections.map(section => `#${section}`).join(','), intersectionHandler);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled ? 'true' : 'false'} id={headerID}>
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center px-5 sm:grid-cols-[1fr_auto_1fr] sm:px-6 lg:px-8">
          {/* left — brand */}
          <Link
            aria-label="Back to top"
            className="group pointer-events-auto flex items-center gap-3 justify-self-start"
            href="#hero">
            <BrandMark className="transition-transform duration-300 group-hover:scale-105" />
            <Spotlit
              as="span"
              bloom="0 0 12px rgba(139, 92, 246, 0.6)"
              className="hidden font-display text-base font-semibold tracking-tight text-slate-100 lg:block"
              lit={
                <>
                  <span className="text-accent">{firstName}</span> <span className="text-white">{lastName}</span>
                </>
              }
              margin={28}
              radius="44px">
              {firstName} <span className="text-accent">{lastName}</span>
            </Spotlit>
          </Link>

          {/* center — pill nav, truly centered in the bar */}
          <nav aria-label="Main" className="pointer-events-auto hidden justify-self-center sm:block">
            <div className="flex items-center rounded-full border border-white/10 bg-ink-900/60 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
              {navSections.map(section => (
                <Link
                  aria-current={current === section ? 'true' : undefined}
                  className="nav-link rounded-full px-3 py-1.5 text-sm font-medium"
                  href={`#${section}`}
                  key={section}>
                  {navLabel(section)}
                </Link>
              ))}
            </div>
          </nav>

          {/* right — theme switch, burger on mobile, CTA from sm up */}
          <div className="pointer-events-auto flex items-center gap-2 justify-self-end">
            <ThemeToggle />
            <button
              aria-controls="mobile-nav"
              aria-expanded={isOpen}
              aria-label="Open navigation menu"
              className="glass grid h-10 w-10 place-items-center !rounded-xl text-slate-200 hover:text-lime sm:hidden"
              onClick={() => setOpen(true)}>
              {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
            <CtaLink className="hidden sm:inline-flex" iconClassName="group-hover:-rotate-6" />
          </div>
        </div>

        {/* reading progress along the bottom edge of the bar */}
        <span aria-hidden="true" className="header-progress" ref={progressRef} style={{transform: 'scaleX(0)'}} />
      </header>

      <Transition appear as={Fragment} show={isOpen}>
        <Dialog className="relative z-50 sm:hidden" initialFocus={closeButtonRef} onClose={closeDrawer}>
          <Transition.Child
            as="div"
            className="drawer-backdrop fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-sm"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Backdrop />
          </Transition.Child>

          <Transition.Child
            as="div"
            className="drawer-slide fixed inset-0 z-50"
            enter="ease-out duration-250"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full">
            <Dialog.Panel
              className="drawer-panel absolute left-0 top-0 flex h-full w-[85%] max-w-xs flex-col overflow-y-auto"
              id="mobile-nav">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <Link aria-label="Back to top" className="flex items-center gap-3" href="#hero" onClick={closeDrawer}>
                  <BrandMark className="h-8 w-8 text-xs" />
                  <span className="flex flex-col">
                    <Spotlit
                      as="span"
                      bloom="0 0 12px rgba(139, 92, 246, 0.6)"
                      className="font-display text-base font-semibold tracking-tight text-slate-100"
                      lit={
                        <>
                          <span className="text-accent">{firstName}</span>{' '}
                          <span className="text-white">{lastName}</span>
                        </>
                      }
                      margin={28}
                      radius="44px">
                      {firstName} <span className="text-accent">{lastName}</span>
                    </Spotlit>
                    <span className="text-xs text-slate-400">{profile.role}</span>
                  </span>
                </Link>
                <button
                  aria-label="Close navigation menu"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                  onClick={closeDrawer}
                  ref={closeButtonRef}>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-5">
                {navSections.map((section, index) => (
                  <Link
                    aria-current={current === section ? 'true' : undefined}
                    className={classNames(
                      'group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors',
                      current === section ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]',
                    )}
                    href={`#${section}`}
                    key={section}
                    onClick={closeDrawer}>
                    <span
                      aria-hidden="true"
                      className="font-display text-[11px] font-semibold tracking-[0.2em] text-smoke-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={classNames(
                        // body font (Inter) — same voice as the desktop pill nav and the rest of the site
                        'text-lg font-medium tracking-tight',
                        current === section ? 'text-lime' : 'text-slate-300 group-hover:text-white',
                      )}>
                      {navLabel(section)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        'ml-auto h-1.5 w-1.5 flex-none rounded-full',
                        current === section ? 'bg-lime shadow-glow-sm' : 'bg-white/15 group-hover:bg-white/30',
                      )}
                    />
                  </Link>
                ))}
              </nav>

              <div className="px-4">
                <CtaLink className="w-full justify-center !py-3.5" />
              </div>

              <div className="flex items-center justify-center gap-3 px-6 py-6">
                {socialLinks.map(social => (
                  <a
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition-colors hover:border-white/25 hover:text-white"
                    href={social.href}
                    key={social.label}
                    rel="noreferrer"
                    target="_blank">
                    <social.Icon className="h-4 w-4" />
                    {social.label}
                  </a>
                ))}
              </div>

              <div className="mt-auto border-t border-white/10 px-6 py-5 text-xs leading-relaxed text-slate-500">
                {emailItem && (
                  <ProtectedContact className="text-slate-400 transition-colors hover:text-lime" item={emailItem} />
                )}
                <br />
                {profile.location} · © {new Date().getFullYear()}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
});

Header.displayName = 'Header';
export default Header;
