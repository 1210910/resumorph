import {ArrowTopRightOnSquareIcon, ChevronDownIcon, StarIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {FC, memo, useCallback, useState} from 'react';

import {SectionId} from '../../data/data';
import {Project} from '../../data/dataDef';
import {since, useProjects} from '../../lib/projects';
import Section from '../Layout/Section';
import Reveal from '../Reveal';
import SectionHeader from '../SectionHeader';

/**
 * Projects as an `argocd app list`: one row per GitHub repo (facts fetched at build
 * time), and clicking a row expands its `argocd app get` view in place.
 */
const COLS =
  'grid grid-cols-[minmax(0,1fr)_auto_1.25rem] items-center gap-4 sm:grid-cols-[minmax(0,1.6fr)_7rem_5rem_5rem_4rem_6rem_1.25rem]';

const ProjectRow: FC<{project: Project; open: boolean; onToggle: (name: string) => void}> = memo(
  ({project, open, onToggle}) => {
    const toggle = useCallback(() => onToggle(project.name), [onToggle, project.name]);
    const panelId = `project-${project.name}`;
    return (
      <li className="border-t border-white/10 first:border-t-0">
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className={classNames(
            COLS,
            'w-full px-5 py-3.5 text-left font-mono text-[13px] transition-colors hover:bg-white/[0.03]',
          )}
          onClick={toggle}
          type="button">
          <span className="truncate text-slate-100">{project.name}</span>
          <span className="hidden truncate text-slate-400 sm:block">{project.language ?? '-'}</span>
          <span className="hidden term-ok sm:block">Synced</span>
          <span className="term-ok">Healthy</span>
          <span className="hidden items-center gap-1 text-slate-400 sm:flex">
            <StarIcon className="h-3.5 w-3.5" />
            {project.stars}
          </span>
          <span className="hidden text-slate-500 sm:block">{since(project.pushedAt) || '-'}</span>
          <ChevronDownIcon
            className={classNames('h-4 w-4 text-slate-500 transition-transform motion-reduce:transition-none', {
              'rotate-180': open,
            })}
          />
        </button>
        {open && (
          <div className="px-5 pb-5 font-mono text-[13px]" id={panelId}>
            <p className="term-accent">$ argocd app get {project.name.toLowerCase()}</p>
            {project.description && (
              <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-slate-300">{project.description}</p>
            )}
            {project.topics.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.topics.map(topic => (
                  <li className="tech-tag rounded-full border border-white/10 px-2.5 py-0.5 text-xs" key={topic}>
                    {topic}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                className="term-link inline-flex items-center gap-1.5"
                href={project.url}
                rel="noreferrer"
                target="_blank">
                {project.repo}
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>
              {project.homepage && (
                <a
                  className="term-link inline-flex items-center gap-1.5"
                  href={project.homepage}
                  rel="noreferrer"
                  target="_blank">
                  live
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </li>
    );
  },
);

ProjectRow.displayName = 'ProjectRow';

const Portfolio: FC = memo(() => {
  const projects = useProjects();
  const [openName, setOpenName] = useState<string | null>(null);
  const onToggle = useCallback((name: string) => setOpenName(current => (current === name ? null : name)), []);

  return (
    <Section sectionId={SectionId.Portfolio}>
      <div className="flex flex-col gap-14">
        <SectionHeader
          description="Things I've built, synced straight from GitHub."
          eyebrow="~/work"
          title="Projects"
        />

        <Reveal>
          <div className="hero-terminal glass overflow-hidden !rounded-2xl text-left">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span aria-hidden="true" className="term-dot h-3 w-3 rounded-full" />
              <span aria-hidden="true" className="term-dot h-3 w-3 rounded-full" />
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-lime shadow-glow-sm" />
              <span className="ml-3 truncate font-mono text-xs text-slate-500">
                <span className="term-accent">$</span> argocd app list
              </span>
            </div>
            {projects.length === 0 ? (
              <p className="px-5 py-8 font-mono text-[13px] text-slate-500">
                No resources found in projects namespace.
              </p>
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className={classNames(
                    COLS,
                    'px-5 pt-4 pb-2 font-mono text-[11px] uppercase tracking-wider text-slate-500',
                  )}>
                  <span>Name</span>
                  <span className="hidden sm:block">Lang</span>
                  <span className="hidden sm:block">Sync</span>
                  <span>Health</span>
                  <span className="hidden sm:block">Stars</span>
                  <span className="hidden sm:block">Last sync</span>
                  <span />
                </div>
                <ul>
                  {projects.map(project => (
                    <ProjectRow
                      key={project.repo}
                      onToggle={onToggle}
                      open={openName === project.name}
                      project={project}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
});

Portfolio.displayName = 'Portfolio';
export default Portfolio;
