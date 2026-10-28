/**
 * Shared style tokens for portfolio content sections.
 *
 * Every content section sits on the single fixed near-black ink base
 * (#0a0a0b); there are no per-section background colors. The one accent
 * is signal violet (#8b5cf6) — used sparingly, never as gradients.
 */
export const SECTION_CLASSES = 'relative';

/** Inner container: centered, generous vertical rhythm. */
export const CONTAINER_CLASSES = 'mx-auto w-full max-w-screen-lg px-6 py-20 md:py-28';

/** Card surface used for content blocks (flat near-black). */
export const CARD_CLASSES = 'glass p-8 md:p-10';

/** Single accent color — the one word-per-headline move (no gradients). */
export const ACCENT_TEXT = 'text-accent';

/** Muted body copy. */
export const BODY_TEXT = 'text-slate-300/90 leading-relaxed';

/** Small heading for groups of pills / timeline entries — lime diamond tick. */
export const GROUP_HEADING = 'block-title text-base';
