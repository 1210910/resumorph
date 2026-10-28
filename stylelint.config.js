/* eslint-env node */

module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-order'],
  plugins: ['stylelint-prettier', 'stylelint-order'],
  rules: {
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'at-rule-no-unknown': [
      true,
      {
        // 'extend' — globalStyles.scss uses `@extend .glass` (plain-postcss parse; no postcss-scss installed)
        ignoreAtRules: ['tailwind', 'extend'],
      },
    ],
  },
};
