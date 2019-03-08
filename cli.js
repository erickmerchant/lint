#!/usr/bin/env node

const stylelintConfig = require('./stylelint-config.js')
const eslintConfig = require('./eslint-config.js')
const path = require('path')
const globby = require('globby')
const {gray, green} = require('kleur')
const outdent = require('outdent')
const mock = require('mock-require')

require('stylelint-config-standard')

mock('@erickmerchant/eslint-plugin', require('./eslint-plugin.js'))

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
  const linters = []

  linters.push({
    extensions: ['.css', '.html'],
    module() { return require('stylelint') },
    async lint(stylelint, files) {
      await stylelint.lint({
        files,
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
    }
  })

  linters.push({
    extensions: ['.mjs', '.js', '.html'],
    module() {
      const eslint = require('eslint')

      require('eslint-plugin-html')

      return eslint
    },
    lint(eslint, files) {
      const CLIEngine = eslint.CLIEngine

      const cli = new CLIEngine({
        fix: args.fix,
        envs: ['es6', 'node'],
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
    }
  })

  await Promise.all(linters.map((linter) => {
    try {
      const _module = linter.module()

      return linter.lint(_module, files.filter((file) => linter.extensions.includes(path.extname(file))))
    } catch (err) {
      return true
    }
  }))

  if (errors.length) {
    console.log(`${gray('[dev]')} ${errors.length} problem${errors.length > 1 ? 's' : ''} found`)

    for (const {file, line, column, message} of errors.sort((a, b) => a.file.localeCompare(b.file))) {
      console.log(`  ${file}:${line}:${column}: ${message}`)
    }

    process.exit(1)
  }
})()
