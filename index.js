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
