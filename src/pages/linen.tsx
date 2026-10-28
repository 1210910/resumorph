import {FC, memo} from 'react';

import example from '../../examples/linen-front-office.yaml';
import {parseResume} from '../content';
import LinenPage from '../themes/linen/LinenPage';

const resume = parseResume(example, 'examples/linen-front-office.yaml');

/**
 * Demo of the Linen theme with a fictional hotel front office manager, so the template's
 * site can show both themes. Your own site doesn't need it: set `theme: linen` in
 * resume.yaml and the home page uses Linen. Delete this page if you like.
 */
const LinenDemo: FC = memo(() => <LinenPage demo resume={resume} />);

export default LinenDemo;
