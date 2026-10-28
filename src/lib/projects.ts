import {createContext, useContext} from 'react';

import {projectRepos} from '../data/data';
import {Project, ProjectRepo} from '../data/dataDef';

interface GithubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  homepage: string | null;
  created_at: string;
  pushed_at: string;
}

/** A project from the hand-written facts only: used for `fromGithub: false` and when GitHub can't be reached. */
const offline = (entry: ProjectRepo): Project => ({
  name: entry.repo.split('/').pop() ?? entry.repo,
  repo: entry.repo,
  url: entry.url ?? `https://github.com/${entry.repo}`,
  description: entry.blurb ?? '',
  language: entry.language ?? null,
  topics: entry.topics ?? [],
  stars: entry.stars ?? 0,
  homepage: entry.homepage ?? null,
  createdAt: entry.createdAt ?? null,
  pushedAt: entry.pushedAt ?? null,
});

const request = (repo: string, token?: string) =>
  fetch(`https://api.github.com/repos/${repo}`, {
    headers: {Accept: 'application/vnd.github+json', ...(token ? {Authorization: `Bearer ${token}`} : {})},
  });

const fetchOne = async (entry: ProjectRepo): Promise<Project> => {
  if (entry.fromGithub === false) return offline(entry);
  const token = process.env.GITHUB_TOKEN;
  try {
    let res = await request(entry.repo, token);
    // a token scoped elsewhere is refused even for public repos: retry anonymously
    if (token && res.status === 401) res = await request(entry.repo);
    if (!res.ok) throw new Error(`${res.status}`);
    const data = (await res.json()) as GithubRepo;
    return {
      name: data.name,
      repo: data.full_name,
      url: data.html_url,
      description: data.description || entry.blurb || '',
      language: data.language,
      topics: data.topics ?? [],
      stars: data.stargazers_count,
      homepage: data.homepage || null,
      createdAt: data.created_at,
      pushedAt: data.pushed_at,
    };
  } catch (error) {
    // a build must never fail because GitHub is rate-limiting: fall back to the config
    console.warn(`[projects] ${entry.repo}: GitHub unavailable (${String(error)}), using config only`);
    return offline(entry);
  }
};

/** Build-time only (getStaticProps): one GitHub call per listed repo. */
export const fetchProjects = (): Promise<Project[]> => Promise.all(projectRepos.map(fetchOne));

export const ProjectsContext = createContext<Project[]>(projectRepos.map(offline));
export const useProjects = () => useContext(ProjectsContext);

/** "3 weeks", "5 months", "2 years" — docker ps style uptime. */
export const since = (iso: string | null, now = Date.now()) => {
  if (!iso) return '';
  const days = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 86_400_000));
  if (days < 1) return 'less than a day';
  if (days < 14) return `${days} day${days === 1 ? '' : 's'}`;
  if (days < 60) return `${Math.floor(days / 7)} weeks`;
  if (days < 730) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
};
