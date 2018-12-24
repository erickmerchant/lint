const stylelint = require('stylelint')

const eslint = require('eslint')

const path = require('path')

const globby = require('globby')

module.exports = (deps) => {
  return async (args) => {
    const files = await globby(args.files, { gitignore: true })

    await stylelint.lint({
      files: files.filter((file) => ['.css'].includes(path.extname(file))),
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
        // possible errors
        // https://eslint.org/docs/rules/no-console
        // https://eslint.org/docs/rules/no-extra-parens
        // https://eslint.org/docs/rules/no-extra-semi
        // https://eslint.org/docs/rules/no-func-assign
        // https://eslint.org/docs/rules/no-inner-declarations
        // https://eslint.org/docs/rules/no-obj-calls
        // https://eslint.org/docs/rules/no-prototype-builtins
        'for-direction': 'error',
        'getter-return': 'error',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': 'error',
        'no-constant-condition': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty-character-class': 'error',
        'no-empty': 'error',
        'no-ex-assign': 'error',
        'no-extra-boolean-cast': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-misleading-character-class': 'error',
        'no-regex-spaces': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'require-atomic-updates': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'error',
        // best practices
        // https://eslint.org/docs/rules/block-scoped-var
        // https://eslint.org/docs/rules/class-methods-use-this
        // https://eslint.org/docs/rules/complexity
        // https://eslint.org/docs/rules/consistent-return
        // https://eslint.org/docs/rules/default-case
        // https://eslint.org/docs/rules/max-classes-per-file
        // https://eslint.org/docs/rules/no-empty-function
        // https://eslint.org/docs/rules/no-empty-pattern
        // https://eslint.org/docs/rules/no-eq-null
        // https://eslint.org/docs/rules/no-extra-bind
        // https://eslint.org/docs/rules/no-extra-label
        // https://eslint.org/docs/rules/no-iterator
        // https://eslint.org/docs/rules/no-magic-numbers
        // https://eslint.org/docs/rules/no-restricted-properties
        // https://eslint.org/docs/rules/no-script-url
        // https://eslint.org/docs/rules/no-unused-labels
        // https://eslint.org/docs/rules/no-useless-call
        // https://eslint.org/docs/rules/no-warning-comments
        // https://eslint.org/docs/rules/require-await
        // https://eslint.org/docs/rules/require-unicode-regexp
        // https://eslint.org/docs/rules/vars-on-top
        // https://eslint.org/docs/rules/wrap-iife

        'accessor-pairs': 'error',
        'array-callback-return': 'error',
        curly: ['error', 'multi-line'],
        'dot-location': ['error', 'property'],
        'dot-notation': 'error',
        'eqeqeq': ['error', 'always', { 'null': 'never' }],
        'guard-for-in': 'error',
        'no-alert': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-div-regex': 'error',
        'no-else-return': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-fallthrough': 'error',
        'no-floating-decimal': 'error',
        'no-global-assign': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-invalid-this': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-param-reassign': 'error',
        'no-proto': 'error',
        'no-redeclare': 'error',
        'no-return-assign': 'error',
        'no-return-await': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unused-expressions': 'error',
        'no-useless-concat': 'error',
        'no-useless-escape': 'error',
        'no-useless-return': 'error',
        'no-void': 'error',
        'no-with': 'error',
        'prefer-promise-reject-errors': 'error',
        radix: 'error',
        yoda: 'error'
      }
    })

    // lint myfile.js and all files in lib/
    const report = cli.executeOnFiles(files.filter((file) => ['.mjs', '.js'].includes(path.extname(file))))

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
