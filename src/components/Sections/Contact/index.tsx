import {DevicePhoneMobileIcon, EnvelopeIcon, MapPinIcon} from '@heroicons/react/24/outline';
import {FC, memo} from 'react';

import {contact, SectionId} from '../../../data/data';
import {ContactType, ContactValue} from '../../../data/dataDef';
import FacebookIcon from '../../Icon/FacebookIcon';
import GithubIcon from '../../Icon/GithubIcon';
import InstagramIcon from '../../Icon/InstagramIcon';
import LinkedInIcon from '../../Icon/LinkedInIcon';
import TwitterIcon from '../../Icon/TwitterIcon';
import Section from '../../Layout/Section';
import ProtectedContact from '../../ProtectedContact';
import Reveal from '../../Reveal';
import SectionHeader from '../../SectionHeader';
import ContactForm from './ContactForm';

const ContactValueMap: Record<ContactType, ContactValue> = {
  [ContactType.Email]: {Icon: EnvelopeIcon, srLabel: 'Email'},
  [ContactType.Phone]: {Icon: DevicePhoneMobileIcon, srLabel: 'Phone'},
  [ContactType.Location]: {Icon: MapPinIcon, srLabel: 'Location'},
  [ContactType.Github]: {Icon: GithubIcon, srLabel: 'Github'},
  [ContactType.LinkedIn]: {Icon: LinkedInIcon, srLabel: 'LinkedIn'},
  [ContactType.Facebook]: {Icon: FacebookIcon, srLabel: 'Facebook'},
  [ContactType.Twitter]: {Icon: TwitterIcon, srLabel: 'Twitter'},
  [ContactType.Instagram]: {Icon: InstagramIcon, srLabel: 'Instagram'},
};

const Contact: FC = memo(() => {
  const {headerText, description, items} = contact;
  return (
    <Section sectionId={SectionId.Contact}>
      <div className="flex flex-col gap-14">
        <SectionHeader description={description} eyebrow="~/contact" title={headerText ?? 'Get in touch.'} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full p-8 md:p-10">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass flex h-full flex-col justify-center gap-8 p-8 md:p-10">
              <div className="flex flex-col gap-5">
                {items.map(item => {
                  const {Icon, srLabel} = ContactValueMap[item.type as keyof typeof ContactValueMap];
                  return (
                    <div className="flex items-center gap-4" key={srLabel}>
                      <span className="glass flex h-11 w-11 flex-none items-center justify-center rounded-xl">
                        <Icon aria-hidden="true" className="h-5 w-5 text-lime" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{srLabel}</dt>
                        {item.secret ? (
                          <ProtectedContact
                            className="block truncate text-sm font-medium text-slate-200 transition-colors hover:text-lime sm:text-base"
                            item={item}
                          />
                        ) : item.href ? (
                          <a
                            className="block truncate text-sm font-medium text-slate-200 transition-colors hover:text-lime sm:text-base"
                            href={item.href}
                            rel="noreferrer"
                            target="_blank">
                            {item.text}
                          </a>
                        ) : (
                          <span className="block truncate text-sm font-medium text-slate-200 sm:text-base">
                            {item.text}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
});

Contact.displayName = 'Contact';
export default Contact;
