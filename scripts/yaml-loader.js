/* eslint-env node */

// Turns resume.yaml (and the examples) into a JS module at build time, so the site can
// `import resume from '../../resume.yaml'`. Validation happens in src/content/index.ts.
const YAML = require('yaml');

module.exports = function yamlLoader(source) {
  const data = YAML.parse(source, {prettyErrors: true});
  return `export default ${JSON.stringify(data)};`;
};
