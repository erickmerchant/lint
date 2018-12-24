#!/usr/bin/env node

const command = require('sergeant')

const lint = require('./index')

command('lint', ({ option, parameter }) => {
  option('fix', {
    description: 'fix what can be fixed'
  })

  parameter('files', {
    description: 'what files to lint',
    type (val) {
      return val
    },
    multiple: true
  })

  return (args) => lint({ cwd: process.cwd() })(args)
})(process.argv.slice(2))
