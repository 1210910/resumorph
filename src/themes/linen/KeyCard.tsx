import {EnvelopeIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';

import {decodeSecret, secretHref} from '../../components/ProtectedContact';
import {ContactItem} from '../../data/dataDef';

/**
 * Linen's signature piece: a hotel key card. Tapping it on the reader turns the light green and
 * flips the card to show the email. The email stays encoded until then (see ProtectedContact).
 */

type Stage = 'locked' | 'reading' | 'open';

interface KeyCardProps {
  email: ContactItem;
  name: string;
  initials: string;
  availability?: string;
}

const READ_MS = 700;

const KeyCard: FC<KeyCardProps> = memo(({email, name, initials, availability}) => {
  const [stage, setStage] = useState<Stage>('locked');
  const timer = useRef<number>();
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  // move focus to the revealed link so keyboard users land on it
  useEffect(() => {
    if (stage === 'open') link.current?.focus({preventScroll: true});
  }, [stage]);

  const unlock = useCallback(() => {
    if (stage !== 'locked') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage('open');
      return;
    }
    setStage('reading');
    timer.current = window.setTimeout(() => setStage('open'), READ_MS);
  }, [stage]);

  const open = stage === 'open';
  const address = open && email.secret ? decodeSecret(email.secret) : email.text;
  const firstName = name.split(' ')[0];

  return (
    <div className="mx-auto mt-10 w-full max-w-sm">
      {/* the door reader: its light goes amber while reading, green once open */}
      <div className="mx-auto flex w-40 items-center justify-between rounded-t-xl border border-b-0 border-[#e8dccb]/25 bg-black/25 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#e8dccb]/70">
        <span>{open ? 'Welcome' : stage === 'reading' ? 'Reading…' : 'Tap card'}</span>
        <span
          aria-hidden="true"
          className={classNames(
            'h-2 w-2 rounded-full transition-colors duration-300',
            open
              ? 'bg-[#6fd394] shadow-[0_0_10px_#6fd394]'
              : stage === 'reading'
                ? 'animate-pulse bg-[#f1b860]'
                : 'bg-[#e0715a]',
          )}
        />
      </div>

      <div className="[perspective:1200px]">
        <div
          className={classNames(
            'relative aspect-[1.586] w-full transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none',
            stage === 'reading' && '-translate-y-2 scale-[1.02]',
            open && '[transform:rotateY(180deg)]',
          )}>
          {/* front: the key card */}
          <button
            aria-label={`Unlock ${firstName}'s contact details`}
            className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#efe4d2] via-[#e8dccb] to-[#d6c2a3] p-5 text-left text-[#1f3b33] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] transition-shadow [backface-visibility:hidden] hover:shadow-[0_34px_70px_-25px_rgba(0,0,0,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e9a37f]"
            disabled={stage !== 'locked'}
            onClick={unlock}
            tabIndex={open ? -1 : 0}
            type="button">
            <span aria-hidden="true" className="absolute inset-y-0 right-10 w-6 bg-[#a4532f]/85" />
            <span className="relative flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#1f3b33]/50 font-serif text-sm">
                {initials}
              </span>
              <span className="mr-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1f3b33]/70">
                Guest key
              </span>
            </span>
            <span className="relative">
              <span className="block font-serif text-3xl leading-tight">Contact</span>
              <span className="mt-1 block text-xs text-[#1f3b33]/75">Tap to open {firstName}’s door</span>
            </span>
            <span className="relative flex items-end justify-between text-[10px] uppercase tracking-[0.18em] text-[#1f3b33]/70">
              <span>
                Valid
                <span className="block text-[11px] normal-case tracking-normal text-[#1f3b33]">
                  {availability ?? 'Any time'}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="mr-12 h-7 w-9 rounded-md bg-gradient-to-br from-[#d8b35a] to-[#a8832f]"
              />
            </span>
          </button>

          {/* back: magnetic stripe and the email */}
          <div
            aria-hidden={!open}
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-[#14271f] text-[#e8dccb] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span aria-hidden="true" className="mt-5 h-9 w-full bg-black/70" />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#e9a37f]">Door’s open</span>
              {open && (
                <a
                  className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#e8dccb] px-4 py-2.5 text-sm font-medium text-[#1f3b33] transition-opacity hover:opacity-90"
                  href={secretHref(email)}
                  ref={link}>
                  <EnvelopeIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{address}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

KeyCard.displayName = 'KeyCard';
export default KeyCard;
