#!/usr/bin/env node

const stylelintConfig = require('./stylelint-config.js')
const eslintConfig = require('./eslint-config.js')
const stylelint = require('stylelint')
const eslint = require('eslint')
const path = require('path')
const globby = require('globby')
const {gray, green} = require('kleur')
const outdent = require('outdent')
const mock = require('mock-require')

mock('@erickmerchant/eslint-plugin', require('./eslint-plugin.js'))

require('stylelint-config-standard')

const args = {
  files: [],
  help: false,
  fix: false
}

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('-') && !arg.startsWith('---')) {
    if (arg === '--fix') {
      args.fix = true
    } else {
      args.help = true
    }
  } else {
    args.files.push(arg)
  }
}

if (!args.files.length) {
  args.help = true
}

if (args.help) {
  console.log(outdent`

    ${green('Description:')} lint js and css

    ${green('Usage:')} lint [--fix] [-h] <files>...

    ${green('Parameters:')}

     <files>     what files to lint

    ${green('Options:')}

     --fix       fix what can be fixed
     -h, --help  get help

  `)

  process.exit(1)
}

(async () => {
  const files = await globby(args.files, {gitignore: true})
  const errors = []

  await stylelint.lint({
    files: files.filter((file) => ['.css'].includes(path.extname(file))),
    fix: args.fix,
    formatter(results) {
      for (const result of results.filter((r) => r.errored)) {
        for (const warning of result.warnings) {
          errors.push({
            file: result.source,
            line: warning.line,
            column: warning.column,
            message: warning.text
          })
        }
      }

      return ''
    },
    configBasedir: __dirname,
    config: stylelintConfig
  })

  const CLIEngine = eslint.CLIEngine

  const cli = new CLIEngine({
    fix: args.fix,
    envs: ['es6', 'node'],
    useEslintrc: false,
    ...eslintConfig
  })

  const report = cli.executeOnFiles(files.filter((file) => ['.mjs', '.js'].includes(path.extname(file))))

  for (const result of report.results.filter((r) => r.errorCount || r.warningCount)) {
    for (const message of result.messages) {
      errors.push({
        file: result.filePath,
        line: message.line,
        column: message.column,
        message: message.message
      })
    }
  }

  CLIEngine.outputFixes(report)

  if (errors.length) {
    console.log(`${gray('[dev]')} ${errors.length} problem${errors.length > 1 ? 's' : ''} found`)

    for (const {file, line, column, message} of errors.sort((a, b) => a.file.localeCompare(b.file))) {
      console.log(`  ${file}:${line}:${column}: ${message}`)
    }

    process.exit(1)
  }
})()
