const stylelint = require('stylelint')
const eslint = require('eslint')
const path = require('path')
const globby = require('globby')
const { gray, green } = require('kleur')

require('stylelint-config-standard')

const args = {
  files: [],
  help: false,
  fix: false
}

for (const arg of process.argv) {
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

if (args.help) {
  console.error(`
${ green('Usage:') } lint [--fix] [-h] [<files>]...

${ green('Parameters:') }

<files>     what files to lint

${ green('Options:') }

--fix       fix what can be fixed
-h, --help  get help
  `)

  process.exit(1)
}

(async () => {
  const files = await globby(args.files, { gitignore: true })
  const errors = []

  await stylelint.lint({
    files: files.filter((file) => ['.css'].includes(path.extname(file))),
    fix: args.fix,
    formatter (results) {
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
    config: {
      extends: 'stylelint-config-standard',
      rules: {
        'font-family-name-quotes': 'always-where-recommended',
        'function-url-quotes': 'always',
        'selector-attribute-quotes': 'always',
        'string-quotes': 'single',
        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true
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
      // possible errors
      // https://eslint.org/docs/rules/no-console
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
      'no-extra-parens': ['error', 'all', { enforceForArrowConditionals: false }],
      'no-extra-semi': 'error',
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
      eqeqeq: ['error', 'always', { null: 'never' }],
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
      'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
      // node.js
      // https://eslint.org/docs/rules/callback-return
      // https://eslint.org/docs/rules/global-require
      // https://eslint.org/docs/rules/no-mixed-requires
      // https://eslint.org/docs/rules/no-process-env
      // https://eslint.org/docs/rules/no-process-exit
      // https://eslint.org/docs/rules/no-restricted-modules
      // https://eslint.org/docs/rules/no-sync
      'handle-callback-err': 'error',
      'no-buffer-constructor': 'error',
      'no-new-require': 'error',
      'no-path-concat': 'error',
      // stylistic
      // https://eslint.org/docs/rules/capitalized-comments
      // https://eslint.org/docs/rules/consistent-this
      // https://eslint.org/docs/rules/func-name-matching
      // https://eslint.org/docs/rules/func-names
      // https://eslint.org/docs/rules/func-style
      // https://eslint.org/docs/rules/id-blacklist
      // https://eslint.org/docs/rules/id-length
      // https://eslint.org/docs/rules/id-match
      // https://eslint.org/docs/rules/jsx-quotes
      // https://eslint.org/docs/rules/line-comment-position
      // https://eslint.org/docs/rules/lines-around-comment
      // https://eslint.org/docs/rules/max-depth
      // https://eslint.org/docs/rules/max-len
      // https://eslint.org/docs/rules/max-lines
      // https://eslint.org/docs/rules/max-lines-per-function
      // https://eslint.org/docs/rules/max-nested-callbacks
      // https://eslint.org/docs/rules/max-params
      // https://eslint.org/docs/rules/max-statements
      // https://eslint.org/docs/rules/max-statements-per-line
      // https://eslint.org/docs/rules/multiline-comment-style
      // https://eslint.org/docs/rules/new-cap
      // https://eslint.org/docs/rules/new-parens
      // https://eslint.org/docs/rules/newline-per-chained-call
      // https://eslint.org/docs/rules/no-bitwise
      // https://eslint.org/docs/rules/no-continue
      // https://eslint.org/docs/rules/no-mixed-spaces-and-tabs
      // https://eslint.org/docs/rules/no-negated-condition
      // https://eslint.org/docs/rules/no-plusplus
      // https://eslint.org/docs/rules/no-restricted-syntax
      // https://eslint.org/docs/rules/no-tabs
      // https://eslint.org/docs/rules/no-ternary
      // https://eslint.org/docs/rules/no-underscore-dangle
      // https://eslint.org/docs/rules/one-var-declaration-per-line
      // https://eslint.org/docs/rules/operator-assignment
      // https://eslint.org/docs/rules/padding-line-between-statements
      // https://eslint.org/docs/rules/sort-keys
      // https://eslint.org/docs/rules/sort-vars
      // https://eslint.org/docs/rules/wrap-regex
      'array-bracket-newline': ['error', 'consistent'],
      'array-bracket-spacing': ['error', 'never'],
      'array-element-newline': ['error', 'consistent'],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      camelcase: 'error',
      'comma-dangle': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'computed-property-spacing': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'function-paren-newline': ['error', 'multiline'],
      'implicit-arrow-linebreak': ['error', 'beside'],
      indent: ['error', 2, {
        SwitchCase: 1
      }],
      'key-spacing': ['error', { mode: 'minimum' }],
      'linebreak-style': ['error', 'unix'],
      'lines-between-class-members': ['error', 'always'],
      'multiline-ternary': ['error', 'always-multiline'],
      'no-array-constructor': 'error',
      'no-inline-comments': 'error',
      'no-lonely-if': 'error',
      'no-mixed-operators': 'error',
      'no-multi-assign': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-nested-ternary': 'error',
      'no-new-object': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      'no-whitespace-before-property': 'error',
      'nonblock-statement-body-position': ['error', 'beside'],
      'object-curly-newline': ['error', { consistent: true }],
      'object-curly-spacing': ['error', 'always'],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'one-var': ['error', 'never'],
      'operator-linebreak': ['error', 'before'],
      'padded-blocks': ['error', 'never'],
      'prefer-object-spread': 'error',
      'quote-props': ['error', 'as-needed'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'semi-spacing': ['error', { before: false, after: true }],
      'semi-style': ['error', 'first'],
      'space-before-blocks': 'error',
      'space-before-function-paren': 'error',
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': ['error', 'always'],
      'switch-colon-spacing': 'error',
      'template-tag-spacing': ['error', 'never'],
      'unicode-bom': 'error',
      // es6
      // https://eslint.org/docs/rules/constructor-super
      // https://eslint.org/docs/rules/no-class-assign
      // https://eslint.org/docs/rules/no-restricted-imports
      // https://eslint.org/docs/rules/prefer-destructuring
      // https://eslint.org/docs/rules/prefer-numeric-literals
      // https://eslint.org/docs/rules/require-yield
      // https://eslint.org/docs/rules/sort-imports
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': 'error',
      'generator-star-spacing': ['error', { before: true, after: false }],
      'no-confusing-arrow': ['error', { allowParens: true }],
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-duplicate-imports': 'error',
      'no-new-symbol': 'error',
      'no-this-before-super': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'rest-spread-spacing': ['error', 'never'],
      'symbol-description': 'error',
      'template-curly-spacing': ['error', 'always'],
      'yield-star-spacing': ['error', 'both']
    }
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
    console.log(`${ gray('[dev]') } ${ errors.length } problem${ errors.length > 1 ? 's' : '' } found`)

    for (const { file, line, column, message } of errors.sort((a, b) => a.file.localeCompare(b.file))) {
      console.log(`  ${ file }:${ line }:${ column }: ${ message }`)
    }

    process.exit(1)
  }
})()
