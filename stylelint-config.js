require('stylelint-config-standard')

const path = require('path')

module.exports = {
  extends: 'stylelint-config-standard',
  plugins: [
    path.join(__dirname, 'plugins/no-duplicate-declarations.js')
  ],
  rules: {
    '@erickmerchant/no-duplicate-declations': true,
    'font-family-name-quotes': 'always-where-recommended',
    'function-url-quotes': 'always',
    'selector-attribute-quotes': 'always',
    'string-quotes': 'single',
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    indentation: 2
  }
}
