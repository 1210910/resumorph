import classNames from 'classnames';
import {FC, FormEvent, KeyboardEvent, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  aboutData,
  contact,
  cvPdf,
  education,
  experience,
  nowData,
  profile,
  SectionId,
  skills,
  socialLinks,
} from '../data/data';
import {ContactType, Project} from '../data/dataDef';
import {since, useProjects} from '../lib/projects';
import {toggleTheme} from './ThemeToggle';

/**
 * The hero's live terminal. On first view it types `whoami` and prints the pitch,
 * then hands over a real prompt: Unix basics, kubectl/helm/terraform-flavoured
 * commands and a few easter eggs, all answered from data.tsx. Under
 * prefers-reduced-motion the intro appears instantly.
 */

type Tone = 'cmd' | 'out' | 'muted' | 'accent' | 'ok' | 'warn' | 'error';

interface Line {
  id: number;
  tone: Tone;
  content: ReactNode;
}

type Output = Array<[Tone, ReactNode]>;

const PROMPT = `${profile.handle}@platform:~$`;

const toneClass: Record<Tone, string> = {
  cmd: 'text-slate-100',
  out: 'text-slate-300',
  muted: 'text-slate-500',
  accent: 'term-accent',
  ok: 'term-ok',
  warn: 'term-warn',
  error: 'term-error',
};

const email = contact.items.find(item => item.type === ContactType.Email);
const linkOf = (label: string) => socialLinks.find(social => social.label === label)?.href;

/** A profile URL without the scheme, e.g. "github.com/alex". */
const bare = (href = '') => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const link = (href: string, text: string, external = true) => (
  <a className="term-link" href={href} {...(external ? {target: '_blank', rel: 'noreferrer'} : {})}>
    {text}
  </a>
);

const scrollTo = (id: SectionId) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});

const pad = (text: string, width: number) => text.padEnd(width, ' ');

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Column-aligned rows (kubectl/helm tables) scroll sideways instead of wrapping. */
const isTableRow = (content: ReactNode) => typeof content === 'string' && /\S {2,}\S/.test(content);

/** Every command the prompt understands. Keys are matched after trimming and collapsing spaces. */
const COMMANDS: Record<string, {hint?: string; hidden?: boolean; run: (args: string) => Output}> = {
  help: {
    hint: 'list commands',
    run: () => [
      ['muted', 'basics'],
      ['out', '  whoami · ls · cat about.md · cat skills.yaml · contact · cv'],
      ['muted', 'platform'],
      ['out', '  kubectl get experience · kubectl describe role'],
      ['out', '  helm list skills · terraform plan career'],
      ['muted', 'projects'],
      ['out', '  argocd app list · argocd app get <name>'],
      ['muted', 'misc'],
      ['out', '  open github|linkedin · theme · history · clear'],
      ['muted', 'tip: ↑/↓ for history, Tab to complete. some commands are not listed.'],
    ],
  },
  whoami: {
    hint: 'who is this',
    run: () => [
      ['accent', `${nowData.title} @ ${nowData.company}`],
      ['out', nowData.pitch],
    ],
  },
  ls: {
    hint: 'list files',
    run: () => [['out', 'about.md  skills.yaml  experience/  education/  contact.txt  cv.pdf']],
  },
  'cat about.md': {
    run: () => [['out', aboutData.description]],
  },
  'cat skills.yaml': {
    run: () =>
      skills
        .slice(0, 6)
        .map(group => ['out', `${group.name.toLowerCase()}: [${group.skills.join(', ')}]`] as [Tone, string]),
  },
  'cat contact.txt': {run: () => COMMANDS.contact.run('')},
  'ls experience': {run: () => COMMANDS['kubectl get experience'].run('')},
  'ls education': {
    run: () => education.map(item => ['out', `${item.date}  ${item.title} — ${item.location}`] as [Tone, string]),
  },
  'cat cv.pdf': {run: () => COMMANDS.cv.run('')},
  'kubectl get experience': {
    hint: 'roles, k8s style',
    run: () => {
      const rows = experience.flatMap(company =>
        company.positions.map(position => ({
          name: slug(position.title),
          company: company.company,
          status: /present/i.test(position.date) ? 'Running' : 'Completed',
          age: position.date,
        })),
      );
      return [
        ['muted', `${pad('NAME', 22)}${pad('COMPANY', 28)}${pad('STATUS', 11)}AGE`],
        ...rows.map(
          row =>
            [
              row.status === 'Running' ? 'ok' : 'out',
              `${pad(row.name, 22)}${pad(row.company, 28)}${pad(row.status, 11)}${row.age}`,
            ] as [Tone, string],
        ),
      ];
    },
  },
  'kubectl describe role': {
    run: () => [
      ['out', `Name:       ${nowData.title}`],
      ['out', `Namespace:  ${nowData.company.toLowerCase().replace(/\s+/g, '-')}`],
      ['out', `Since:      ${nowData.since}`],
      ['out', 'Containers:'],
      ...nowData.highlights.map(h => ['out', `  ${h.title}: ${h.text}`] as [Tone, string]),
      ['ok', 'Status:     Running'],
    ],
  },
  'kubectl get pods': {
    hidden: true,
    run: () => [
      ['muted', `${pad('NAME', 28)}${pad('READY', 8)}STATUS`],
      ...nowData.stack.map(
        layer => ['ok', `${pad(`${layer.layer.toLowerCase()}-7c9f`, 28)}${pad('1/1', 8)}Running`] as [Tone, string],
      ),
    ],
  },
  'helm list skills': {
    run: () => [
      ['muted', `${pad('NAME', 26)}${pad('CHART', 22)}STATUS`],
      ...skills
        .slice(0, 6)
        .map(
          group =>
            ['out', `${pad(slug(group.name), 26)}${pad(`${group.skills.length} skills`, 22)}deployed`] as [
              Tone,
              string,
            ],
        ),
    ],
  },
  'terraform plan career': {
    run: () => [
      ['out', 'Terraform will perform the following actions:'],
      ['warn', '  ~ resource "degree" "msc" { status = "in progress" -> "done" }'],
      ['ok', '  + resource "role" "next"  { team = "yours?" }'],
      ['out', 'Plan: 1 to add, 1 to change, 0 to destroy. run `contact` to apply.'],
    ],
  },
  contact: {
    hint: 'get in touch',
    run: () => [
      ['out', <>email {email ? link(email.href ?? '#', email.text, false) : '—'}</>],
      ['out', <>github {link(linkOf('Github') ?? '#', bare(linkOf('Github')))}</>],
      ['out', <>linkedin {link(linkOf('LinkedIn') ?? '#', bare(linkOf('LinkedIn')).replace('linkedin.com/', ''))}</>],
    ],
  },
  cv: {
    hint: 'download the PDF',
    run: () => {
      const a = document.createElement('a');
      a.href = cvPdf;
      a.download = profile.cvFileName;
      a.click();
      return [
        ['ok', `downloading ${profile.cvFileName} (one page, ATS-friendly)…`],
        ['muted', <>not starting? {link(cvPdf, 'open it here')}. or run `resume` to scroll to it.</>],
      ];
    },
  },
  resume: {
    hidden: true,
    run: () => {
      scrollTo(SectionId.Resume);
      return [['muted', 'scrolling to the resume…']];
    },
  },
  'open github': {
    run: () => {
      window.open(linkOf('Github'), '_blank', 'noopener');
      return [['muted', 'opening github…']];
    },
  },
  'open linkedin': {
    run: () => {
      window.open(linkOf('LinkedIn'), '_blank', 'noopener');
      return [['muted', 'opening linkedin…']];
    },
  },
  theme: {
    hint: 'light / dark',
    run: () => {
      toggleTheme();
      return [['muted', 'theme switched.']];
    },
  },
  [`sudo hire ${profile.handle}`]: {
    hidden: true,
    run: () => [
      ['ok', '[sudo] permission granted. great choice.'],
      ['out', <>next step: {email ? link(email.href ?? '#', email.text, false) : 'see contact'} or run `contact`</>],
    ],
  },
  'rm -rf /': {
    hidden: true,
    run: () => [
      ['error', 'rm: refusing to remove "/": this cluster is protected by GitOps.'],
      ['muted', 'argo cd would have rolled it back anyway.'],
    ],
  },
  exit: {
    hidden: true,
    run: () => [['muted', "there's no escape. try `contact` instead."]],
  },
  [`kubectl delete ${profile.handle}`]: {
    hidden: true,
    run: () => [
      ['warn', `Error from server (Forbidden): ${profile.handle} is a critical workload. PodDisruptionBudget says no.`],
    ],
  },
};

/**
 * Projects as Argo CD Applications (each one is a Git repo, after all), with the
 * kubectl spelling as an alias. Answered from the GitHub data baked in at build time.
 */
const LIST = ['argocd app list', 'kubectl get deployments -n projects', 'kubectl get deploy -n projects'];
const GET = ['argocd app get ', 'kubectl describe deployment ', 'kubectl describe deploy '];

const projectCommand = (command: string, projects: Project[]): Output | null => {
  if (LIST.includes(command)) {
    if (!projects.length) return [['muted', 'No resources found in projects namespace.']];
    return [
      ['muted', `${pad('NAME', 24)}${pad('LANG', 12)}${pad('SYNC', 8)}${pad('HEALTH', 9)}${pad('STARS', 7)}AGE`],
      ...projects.map(
        project =>
          [
            'ok',
            `${pad(project.name, 24)}${pad(project.language ?? '-', 12)}${pad('Synced', 8)}${pad('Healthy', 9)}${pad(
              String(project.stars),
              7,
            )}${since(project.createdAt) || '-'}`,
          ] as [Tone, string],
      ),
      ['muted', 'details: argocd app get <name>'],
    ];
  }
  const prefix = GET.find(p => command.startsWith(p));
  if (!prefix) return null;
  const name = command.slice(prefix.length).trim();
  const project = projects.find(p => p.name.toLowerCase() === name);
  if (!project) {
    return [
      ['error', `application '${name}' not found`],
      ['muted', projects.length ? `try one of: ${projects.map(p => p.name).join(', ')}` : 'no projects yet.'],
    ];
  }
  return [
    ['out', `Name:         ${project.name}`],
    ['out', <>Repo: {link(project.url, project.repo)}</>],
    ...(project.homepage ? [['out', <>URL: {link(project.homepage, project.homepage)}</>] as [Tone, ReactNode]] : []),
    ['out', `Language:     ${project.language ?? '-'}`],
    ...(project.topics.length ? [['out', `Topics:       ${project.topics.join(', ')}`] as [Tone, string]] : []),
    ['out', `Stars:        ${project.stars}`],
    ...(project.pushedAt ? [['out', `Last Sync:    ${since(project.pushedAt)} ago`] as [Tone, string]] : []),
    ['ok', 'Sync Status:  Synced   Health Status: Healthy'],
    ...(project.description ? [['out', project.description] as [Tone, string]] : []),
  ];
};

const visibleCommands = Object.keys(COMMANDS).filter(name => !COMMANDS[name].hidden);

const normalise = (input: string) => input.trim().replace(/\s+/g, ' ').toLowerCase();

const HeroTerminal: FC = memo(() => {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const nextId = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shortcut, setShortcut] = useState('⌘K');
  const projects = useProjects();
  const completions = useMemo(
    () => [...visibleCommands, 'argocd app list', ...projects.map(p => `argocd app get ${p.name.toLowerCase()}`)],
    [projects],
  );

  // Output streams in like a real shell: prose lines type out, table rows and
  // rich lines (links) land one after another. Reduced motion skips straight to the end.
  const queue = useRef<Line[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const current = useRef<{id: number; text: string} | null>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => clearTimeout(timer.current);
  }, []);

  const pump = useCallback(() => {
    const next = queue.current.shift();
    if (!next) {
      timer.current = undefined;
      return;
    }
    const text = typeof next.content === 'string' && next.tone !== 'cmd' ? next.content : null;
    if (!text || isTableRow(text)) {
      setLines(prev => [...prev, next]);
      timer.current = setTimeout(pump, next.tone === 'cmd' ? 0 : 45);
      return;
    }
    // long lines speed up so none takes much longer than ~¾ s
    const step = Math.max(2, Math.ceil(text.length / 45));
    let shown = 0;
    current.current = {id: next.id, text};
    setLines(prev => [...prev, {...next, content: ''}]);
    const tick = () => {
      shown = Math.min(text.length, shown + step);
      setLines(prev => prev.map(line => (line.id === next.id ? {...line, content: text.slice(0, shown)} : line)));
      if (shown < text.length) {
        timer.current = setTimeout(tick, 16);
      } else {
        current.current = null;
        timer.current = setTimeout(pump, 45);
      }
    };
    timer.current = setTimeout(tick, 16);
  }, []);

  /** Skip the animation: finish the line being typed and print everything queued. */
  const flush = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    const typingLine = current.current;
    const rest = queue.current;
    current.current = null;
    queue.current = [];
    setLines(prev => [
      ...prev.map(line => (typingLine && line.id === typingLine.id ? {...line, content: typingLine.text} : line)),
      ...rest,
    ]);
  }, []);

  const push = useCallback(
    (items: Output) => {
      const next = items.map(([tone, content]) => ({id: nextId.current++, tone, content}));
      if (reduceMotion.current) {
        setLines(prev => [...prev, ...next]);
        return;
      }
      queue.current.push(...next);
      if (!timer.current) pump();
    },
    [pump],
  );

  const clearScreen = useCallback(() => {
    flush();
    setLines([]);
  }, [flush]);

  const run = useCallback(
    (raw: string) => {
      const command = normalise(raw);
      flush();
      push([['cmd', raw]]);
      if (!command) return;
      setHistory(prev => [...prev, raw]);
      if (command === 'clear') {
        clearScreen();
        return;
      }
      if (command === 'history') {
        push(history.concat(raw).map((entry, idx) => ['muted', `${String(idx + 1).padStart(3)}  ${entry}`]));
        return;
      }
      if (command.startsWith('echo ')) {
        push([['out', raw.trim().slice(5)]]);
        return;
      }
      const projectOutput = projectCommand(command, projects);
      if (projectOutput) {
        push(projectOutput);
        return;
      }
      const match = COMMANDS[command];
      if (match) {
        push(match.run(command));
      } else {
        const guess = completions.find(name => name.startsWith(command.split(' ')[0]));
        push([
          ['error', `command not found: ${command}`],
          ['muted', guess ? `did you mean \`${guess}\`? or type \`help\`.` : 'type `help` to see what works.'],
        ]);
      }
    },
    [clearScreen, completions, flush, history, projects, push],
  );

  // intro: type `whoami` once the terminal scrolls into view
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = 'whoami';
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const finish = () => {
      setValue('');
      push([
        ['cmd', intro],
        ...COMMANDS.whoami.run(''),
        ['muted', 'type `help` to explore. try `kubectl get experience`.'],
      ]);
      setTyping(false);
    };

    if (reduceMotion) {
      finish();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        intro.split('').forEach((_, idx) => {
          timers.push(setTimeout(() => setValue(intro.slice(0, idx + 1)), 500 + idx * 90));
        });
        timers.push(setTimeout(finish, 500 + intro.length * 90 + 350));
      },
      {threshold: 0.4},
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [push]);

  // ⌘K / Ctrl+K anywhere, or `/` outside a text field, jumps into the terminal
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inField =
        !!target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      const palette = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
      const slash = event.key === '/' && !inField && !event.metaKey && !event.ctrlKey && !event.altKey;
      if (!palette && !slash) return;
      event.preventDefault();
      rootRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
      inputRef.current?.focus({preventScroll: true});
    };
    window.addEventListener('keydown', onKey);
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut('Ctrl K');
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // keep the newest output in view (inside the terminal only, never the page)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (typing) return;
      run(value);
      setValue('');
      setHistoryIdx(-1);
    },
    [run, typing, value],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowUp' && history.length) {
        event.preventDefault();
        const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setValue(history[idx]);
      } else if (event.key === 'ArrowDown' && historyIdx !== -1) {
        event.preventDefault();
        const idx = historyIdx + 1;
        setHistoryIdx(idx >= history.length ? -1 : idx);
        setValue(idx >= history.length ? '' : history[idx]);
      } else if (event.key === 'Tab' && value.trim()) {
        const typed = normalise(value);
        const options = completions.filter(name => name.startsWith(typed));
        if (options.length === 1) {
          event.preventDefault();
          setValue(options[0]);
        } else if (options.length > 1) {
          event.preventDefault();
          push([
            ['cmd', value],
            ['muted', options.join('   ')],
          ]);
        }
      } else if (event.key.toLowerCase() === 'l' && event.ctrlKey) {
        event.preventDefault();
        clearScreen();
      }
    },
    [clearScreen, completions, history, historyIdx, push, value],
  );

  return (
    <div
      className="hero-terminal glass flex h-[340px] flex-col overflow-hidden !rounded-2xl text-left sm:h-[400px]"
      onClick={() => {
        // click anywhere to type, unless the visitor is selecting text or clicking a link
        if (!window.getSelection()?.toString()) inputRef.current?.focus({preventScroll: true});
      }}
      ref={rootRef}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span aria-hidden="true" className="term-dot h-3 w-3 rounded-full" />
        <span aria-hidden="true" className="term-dot h-3 w-3 rounded-full" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-lime shadow-glow-sm" />
        <span className="ml-3 truncate font-mono text-xs text-slate-500">{profile.handle}@platform: ~ — zsh</span>
        <kbd className="term-kbd ml-auto hidden flex-none rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 sm:inline">
          {shortcut}
        </kbd>
      </div>

      <div
        aria-label="Terminal output"
        aria-live="polite"
        className="term-body min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed sm:text-[13px]"
        ref={scrollRef}
        role="log">
        {lines.map(line =>
          line.tone === 'cmd' ? (
            <p className="break-words" key={line.id}>
              <span className="term-accent">{PROMPT}</span> <span className={toneClass.cmd}>{line.content}</span>
            </p>
          ) : (
            <p
              className={classNames(
                isTableRow(line.content) ? 'whitespace-pre' : 'whitespace-pre-wrap break-words',
                toneClass[line.tone],
              )}
              key={line.id}>
              {line.content}
            </p>
          ),
        )}

        <form className="flex items-center gap-2" onSubmit={onSubmit}>
          <label className="term-accent flex-none" htmlFor="hero-terminal-input">
            {PROMPT}
          </label>
          <input
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="term-input min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[12.5px] text-slate-100 focus:outline-none focus:ring-0 sm:text-[13px]"
            id="hero-terminal-input"
            onChange={event => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            readOnly={typing}
            ref={inputRef}
            spellCheck={false}
            value={value}
          />
        </form>
      </div>
    </div>
  );
});

HeroTerminal.displayName = 'HeroTerminal';
export default HeroTerminal;
