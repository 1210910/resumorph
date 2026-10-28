import {FC, memo, PropsWithChildren, useCallback, useState} from 'react';

import {ContactItem, ContactType} from '../data/dataDef';

/**
 * Email and phone are stored as shifted character codes (encodeSecret in src/content) and only
 * decoded after a person clicks, so they never appear in the static HTML that scrapers harvest
 * (and don't look like secrets to scanners). Turn it off with privacy.hideContactDetails in resume.yaml.
 */
export const decodeSecret = (secret: number[]): string => String.fromCharCode(...secret.map(code => code - 7));

export const secretHref = (item: ContactItem): string | undefined => {
  if (!item.secret) return item.href;
  const value = decodeSecret(item.secret);
  return item.type === ContactType.Phone ? `tel:${value.replace(/\s/g, '')}` : `mailto:${value}`;
};

interface ProtectedContactProps {
  item: ContactItem;
  className?: string;
  /** Class for the visible text (the label before the click, the real value after it). */
  textClassName?: string;
}

const ProtectedContact: FC<PropsWithChildren<ProtectedContactProps>> = memo(
  ({item, className, textClassName, children}) => {
    const [value, setValue] = useState<string | null>(null);
    const reveal = useCallback(() => item.secret && setValue(decodeSecret(item.secret)), [item.secret]);

    // contact protection is off (privacy.hideContactDetails: false): a plain link
    if (!item.secret) {
      return item.href ? (
        <a className={className} href={item.href}>
          <span className={textClassName}>{item.text}</span>
          {children}
        </a>
      ) : null;
    }
    if (value === null) {
      return (
        <button className={`text-left ${className ?? ''}`} onClick={reveal} title="Click to reveal" type="button">
          <span className={textClassName}>{item.text}</span>
          {children}
        </button>
      );
    }
    return (
      <a className={className} href={secretHref(item)}>
        <span className={textClassName}>{value}</span>
        {children}
      </a>
    );
  },
);

ProtectedContact.displayName = 'ProtectedContact';
export default ProtectedContact;
