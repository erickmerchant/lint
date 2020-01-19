#!/usr/bin/env node

const eslint = require('eslint')
const eslintConfig = require('./eslint-config.js')
const path = require('path')
const globby = require('globby')
const {gray, green, red} = require('kleur')
const outdent = require('outdent')

require('eslint-plugin-html')

const extensions = ['.mjs', '.js', '.html']
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
  try {
    let files = await globby(args.files.map((file) => path.resolve(file)), {gitignore: true})

    files = files.filter((file) => extensions.includes(path.extname(file)))

    const errors = []

    const CLIEngine = eslint.CLIEngine

    const cli = new CLIEngine({
      fix: args.fix,
      envs: ['browser', 'node', 'es6'],
      useEslintrc: false,
      ...eslintConfig
    })

    const report = cli.executeOnFiles(files)

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
  } catch (err) {
    console.error(red(err))

    process.exit(1)
  }
})()
