import Head from 'next/head';
import {useRouter} from 'next/router';
import {FC, memo, useEffect} from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** The Linen theme preview used to live here; keep shared links working. */
const HospitalityRedirect: FC = memo(() => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/linen');
  }, [router]);

  return (
    <Head>
      <meta content={`0; url=${basePath}/linen/`} httpEquiv="refresh" />
      <link href={`${basePath}/linen/`} rel="canonical" />
      <meta content="noindex" name="robots" />
    </Head>
  );
});

export default HospitalityRedirect;
