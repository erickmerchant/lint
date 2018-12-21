#!/usr/bin/env node

const command = require('sergeant')
const lint = require('./index')

command('lint', ({ option, parameter }) => {
  option('fix', {
    description: 'fix what can be fixed'
  })

  return (args) => lint({ cwd: process.cwd() })(args)
})(process.argv.slice(2))
