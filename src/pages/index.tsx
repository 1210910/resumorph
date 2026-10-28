import {GetStaticProps} from 'next';
import dynamic from 'next/dynamic';
import {FC, memo} from 'react';

import Footer from '../components/Layout/Footer';
import Page from '../components/Layout/Page';
import About from '../components/Sections/About';
import Contact from '../components/Sections/Contact';
import Hero from '../components/Sections/Hero';
import Now from '../components/Sections/Now';
import Portfolio from '../components/Sections/Portfolio';
import References from '../components/Sections/References';
import Resume from '../components/Sections/Resume';
import {homePageMeta} from '../data/data';
import {Project} from '../data/dataDef';
import {fetchProjects, ProjectsContext} from '../lib/projects';

// eslint-disable-next-line react-memo/require-memo
const Header = dynamic(() => import('../components/Sections/Header'), {ssr: false});

interface HomeProps {
  projects: Project[];
}

const Home: FC<HomeProps> = memo(({projects}) => {
  const {title, description} = homePageMeta;
  return (
    <ProjectsContext.Provider value={projects}>
      <Page description={description} title={title}>
        <Header />
        <Hero />
        <Now />
        <About />
        <Resume />
        <References />
        <Portfolio />
        <Contact />
        <Footer />
      </Page>
    </ProjectsContext.Provider>
  );
});

// the static export bakes the GitHub facts into the page at build time
export const getStaticProps: GetStaticProps<HomeProps> = async () => ({props: {projects: await fetchProjects()}});

export default Home;
