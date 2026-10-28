import {FC, memo} from 'react';

import example from '../../examples/editorial-operations.yaml';
import {parseResume} from '../content';
import EditorialPage from '../themes/editorial/EditorialPage';

const resume = parseResume(example, 'examples/editorial-operations.yaml');

/**
 * Demo of the Editorial theme with a fictional operations director, so the template's site
 * can show every theme. Your own site doesn't need it: set `theme: editorial` in resume.yaml
 * and the home page uses Editorial. Delete this page if you like.
 */
const EditorialDemo: FC = memo(() => <EditorialPage demo resume={resume} />);

export default EditorialDemo;
