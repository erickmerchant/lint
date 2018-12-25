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
              file: result.source,
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
        // https://eslint.org/docs/rules/no-param-reassign
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
        yoda: 'error',
        // variables
        // https://eslint.org/docs/rules/init-declarations
        // https://eslint.org/docs/rules/no-label-var
        // https://eslint.org/docs/rules/no-restricted-globals
        // https://eslint.org/docs/rules/no-shadow
        // https://eslint.org/docs/rules/no-undefined
        // https://eslint.org/docs/rules/no-use-before-define
        'no-delete-var': 'error',
        'no-shadow-restricted-names': 'error',
        'no-undef': 'error',
        'no-undef-init': 'error',
        'no-unused-vars': ['error', {vars: 'all', args: 'none'}],
        // node.js
        // https://eslint.org/docs/rules/callback-return
        // https://eslint.org/docs/rules/global-require
        // https://eslint.org/docs/rules/handle-callback-err
        // https://eslint.org/docs/rules/no-buffer-constructor
        // https://eslint.org/docs/rules/no-mixed-requires
        // https://eslint.org/docs/rules/no-new-require
        // https://eslint.org/docs/rules/no-path-concat
        // https://eslint.org/docs/rules/no-process-env
        // https://eslint.org/docs/rules/no-process-exit
        // https://eslint.org/docs/rules/no-restricted-modules
        // https://eslint.org/docs/rules/no-sync
        // stylistic
        // https://eslint.org/docs/rules/array-bracket-newline
        // https://eslint.org/docs/rules/array-bracket-spacing
        // https://eslint.org/docs/rules/array-element-newline
        // https://eslint.org/docs/rules/block-spacing
        // https://eslint.org/docs/rules/brace-style
        // https://eslint.org/docs/rules/camelcase
        // https://eslint.org/docs/rules/capitalized-comments
        // https://eslint.org/docs/rules/comma-dangle
        // https://eslint.org/docs/rules/comma-spacing
        // https://eslint.org/docs/rules/comma-style
        // https://eslint.org/docs/rules/computed-property-spacing
        // https://eslint.org/docs/rules/consistent-this
        // https://eslint.org/docs/rules/eol-last
        // https://eslint.org/docs/rules/func-call-spacing
        // https://eslint.org/docs/rules/func-name-matching
        // https://eslint.org/docs/rules/func-names
        // https://eslint.org/docs/rules/func-style
        // https://eslint.org/docs/rules/function-paren-newline
        // https://eslint.org/docs/rules/id-blacklist
        // https://eslint.org/docs/rules/id-length
        // https://eslint.org/docs/rules/id-match
        // https://eslint.org/docs/rules/implicit-arrow-linebreak
        // https://eslint.org/docs/rules/indent
        // https://eslint.org/docs/rules/jsx-quotes
        // https://eslint.org/docs/rules/key-spacing
        // https://eslint.org/docs/rules/keyword-spacing
        // https://eslint.org/docs/rules/line-comment-position
        // https://eslint.org/docs/rules/linebreak-style
        // https://eslint.org/docs/rules/lines-around-comment
        // https://eslint.org/docs/rules/lines-between-class-members
        // https://eslint.org/docs/rules/max-depth
        // https://eslint.org/docs/rules/max-len
        // https://eslint.org/docs/rules/max-lines
        // https://eslint.org/docs/rules/max-lines-per-function
        // https://eslint.org/docs/rules/max-nested-callbacks
        // https://eslint.org/docs/rules/max-params
        // https://eslint.org/docs/rules/max-statements
        // https://eslint.org/docs/rules/max-statements-per-line
        // https://eslint.org/docs/rules/multiline-comment-style
        // https://eslint.org/docs/rules/multiline-ternary
        // https://eslint.org/docs/rules/new-cap
        // https://eslint.org/docs/rules/new-parens
        // https://eslint.org/docs/rules/newline-per-chained-call
        // https://eslint.org/docs/rules/no-array-constructor
        // https://eslint.org/docs/rules/no-bitwise
        // https://eslint.org/docs/rules/no-continue
        // https://eslint.org/docs/rules/no-inline-comments
        // https://eslint.org/docs/rules/no-lonely-if
        // https://eslint.org/docs/rules/no-mixed-operators
        // https://eslint.org/docs/rules/no-mixed-spaces-and-tabs
        // https://eslint.org/docs/rules/no-multi-assign
        // https://eslint.org/docs/rules/no-multiple-empty-lines
        // https://eslint.org/docs/rules/no-negated-condition
        // https://eslint.org/docs/rules/no-nested-ternary
        // https://eslint.org/docs/rules/no-new-object
        // https://eslint.org/docs/rules/no-plusplus
        // https://eslint.org/docs/rules/no-restricted-syntax
        // https://eslint.org/docs/rules/no-tabs
        // https://eslint.org/docs/rules/no-ternary
        // https://eslint.org/docs/rules/no-trailing-spaces
        // https://eslint.org/docs/rules/no-underscore-dangle
        // https://eslint.org/docs/rules/no-unneeded-ternary
        // https://eslint.org/docs/rules/no-whitespace-before-property
        // https://eslint.org/docs/rules/nonblock-statement-body-position
        // https://eslint.org/docs/rules/object-curly-newline
        // https://eslint.org/docs/rules/object-curly-spacing
        // https://eslint.org/docs/rules/object-property-newline
        // https://eslint.org/docs/rules/one-var
        // https://eslint.org/docs/rules/one-var-declaration-per-line
        // https://eslint.org/docs/rules/operator-assignment
        // https://eslint.org/docs/rules/operator-linebreak
        // https://eslint.org/docs/rules/padded-blocks
        // https://eslint.org/docs/rules/padding-line-between-statements
        // https://eslint.org/docs/rules/prefer-object-spread
        // https://eslint.org/docs/rules/quote-props
        // https://eslint.org/docs/rules/quotes
        // https://eslint.org/docs/rules/semi
        // https://eslint.org/docs/rules/semi-spacing
        // https://eslint.org/docs/rules/semi-style
        // https://eslint.org/docs/rules/sort-keys
        // https://eslint.org/docs/rules/sort-vars
        // https://eslint.org/docs/rules/space-before-blocks
        // https://eslint.org/docs/rules/space-before-function-paren
        // https://eslint.org/docs/rules/space-in-parens
        // https://eslint.org/docs/rules/space-infix-ops
        // https://eslint.org/docs/rules/space-unary-ops
        // https://eslint.org/docs/rules/spaced-comment
        // https://eslint.org/docs/rules/switch-colon-spacing
        // https://eslint.org/docs/rules/template-tag-spacing
        // https://eslint.org/docs/rules/unicode-bom
        // https://eslint.org/docs/rules/wrap-regex
        // es6
        // https://eslint.org/docs/rules/arrow-body-style
        // https://eslint.org/docs/rules/arrow-parens
        // https://eslint.org/docs/rules/arrow-spacing
        // https://eslint.org/docs/rules/constructor-super
        // https://eslint.org/docs/rules/generator-star-spacing
        // https://eslint.org/docs/rules/no-class-assign
        // https://eslint.org/docs/rules/no-confusing-arrow
        // https://eslint.org/docs/rules/no-const-assign
        // https://eslint.org/docs/rules/no-dupe-class-members
        // https://eslint.org/docs/rules/no-duplicate-imports
        // https://eslint.org/docs/rules/no-new-symbol
        // https://eslint.org/docs/rules/no-restricted-imports
        // https://eslint.org/docs/rules/no-this-before-super
        // https://eslint.org/docs/rules/no-useless-computed-key
        // https://eslint.org/docs/rules/no-useless-constructor
        // https://eslint.org/docs/rules/no-useless-rename
        // https://eslint.org/docs/rules/no-var
        // https://eslint.org/docs/rules/object-shorthand
        // https://eslint.org/docs/rules/prefer-arrow-callback
        // https://eslint.org/docs/rules/prefer-const
        // https://eslint.org/docs/rules/prefer-destructuring
        // https://eslint.org/docs/rules/prefer-numeric-literals
        // https://eslint.org/docs/rules/prefer-rest-params
        // https://eslint.org/docs/rules/prefer-spread
        // https://eslint.org/docs/rules/prefer-template
        // https://eslint.org/docs/rules/require-yield
        // https://eslint.org/docs/rules/rest-spread-spacing
        // https://eslint.org/docs/rules/sort-imports
        // https://eslint.org/docs/rules/symbol-description
        // https://eslint.org/docs/rules/template-curly-spacing
        // https://eslint.org/docs/rules/yield-star-spacing
      }
    })

    // lint myfile.js and all files in lib/
    const report = cli.executeOnFiles(files.filter((file) => ['.mjs', '.js'].includes(path.extname(file))))

    for (const result of report.results.filter((r) => r.errorCount || r.warningCount)) {
      for (const message of result.messages) {
        console.log({
          file: result.filePath,
          line: message.line,
          column: message.column,
          message: message.message
        })
      }
    }

    CLIEngine.outputFixes(report)
  }
}
