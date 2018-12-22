const stylelint = require('stylelint')

const eslint = require('eslint')

const path = require('path')

module.exports = (deps) => {
  return async (args) => {
    await stylelint.lint({
      files: path.join(deps.cwd, '**/*.css'),
      fix: args.fix,
      formatter (results) {
        for (const result of results.filter((r) => r.errored)) {
          for (const warning of result.warnings) {
            console.log({
              file: path.relative(deps.cwd, result.source),
              line: warning.line,
              column: warning.column,
              message: warning.text
            })
          }
        }

        return ''
      },
      config: {
        rules: {
          indentation: 2
        }
      }
    })

    const CLIEngine = eslint.CLIEngine

    const cli = new CLIEngine({
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      envs: ['es6', 'node'],
      useEslintrc: false,
      fix: args.fix,
      rules: {
        semi: ['error', 'never'],
        indent: ['error', 2, {
          SwitchCase: 1
        }],
        // 'no-irregular-whitespace': ['error'],
        // 'no-multi-spaces': ['error'],
        // 'brace-style': ['error', '1tbs', {
        //   allowSingleLine: true
        // }],
        // 'block-spacing': ['error', 'never'],
        // curly: ['error', 'multi-line'],
        // 'func-call-spacing': ['error', 'never'],
        // 'space-before-function-paren': ['error', 'always'],
        // quotes: ['error', 'single'],
        // 'space-before-blocks': 'error',
        // 'no-var': 'error',
        // 'prefer-const': 'error',
        // 'quote-props': ['error', 'as-needed'],
        // 'prefer-template': ['error'],
        // 'template-curly-spacing': ['error', 'always'],
        // 'padded-blocks': ['error', 'never'],
        // 'padding-line-between-statements': ['error', {
        //   blankLine: 'always',
        //   prev: '*',
        //   next: '*'
        // }],
        // 'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }]
      }
    })

    // lint myfile.js and all files in lib/
    const report = cli.executeOnFiles([path.join(deps.cwd, '**/*.{js,mjs}')])

    for (const result of report.results.filter((r) => r.errorCount || r.warningCount)) {
      for (const message of result.messages) {
        console.log({
          file: path.relative(deps.cwd, result.filePath),
          line: message.line,
          column: message.column,
          message: message.message
        })
      }
    }

    CLIEngine.outputFixes(report)
  }
}
