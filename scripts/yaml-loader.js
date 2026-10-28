/* eslint-env node */

// Turns resume.yaml (and the examples) into a JS module at build time, so the site can
// `import resume from '../../resume.yaml'`. Validation happens in src/content/index.ts.
//
// Unless privacy.hideContactDetails is false, basics.email and basics.phone are replaced here by
// shifted character codes ({encoded: [...]}), so the plain values never reach the HTML or the JS
// bundles. src/components/ProtectedContact.tsx decodes them when a visitor clicks.
const YAML = require('yaml');

const encode = value => ({encoded: [...value].map(char => char.charCodeAt(0) + 7)});

module.exports = function yamlLoader(source) {
  const data = YAML.parse(source, {prettyErrors: true});
  const basics = data && data.basics;
  if (basics && !(data.privacy && data.privacy.hideContactDetails === false)) {
    if (typeof basics.email === 'string') {
      // checked here because the schema only sees the encoded value
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) {
        throw new Error(`basics.email: "${basics.email}" is not a valid email address`);
      }
      basics.email = encode(basics.email);
    }
    if (typeof basics.phone === 'string' || typeof basics.phone === 'number') {
      basics.phone = encode(String(basics.phone));
    }
  }
  return `export default ${JSON.stringify(data)};`;
};
