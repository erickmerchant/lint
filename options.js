const eslint = require('eslint')
const path = require('path')
const pkg = require('./package.json')

module.exports = {
  // homepage, version and bugs pulled from package.json
  version: pkg.version,
  homepage: pkg.homepage,
  bugs: pkg.bugs ? pkg.bugs.url : '',
  eslint: eslint, // pass any version of eslint >= 1.0.0
  cmd: 'lint', // should match the "bin" key in your package.json
  tagline: 'Standard plus some more', // displayed in output --help
  eslintConfig: {
    configFile: path.join(__dirname, 'eslintrc.json')
  },
  cwd: process.cwd() // current working directory, passed to eslint
}
