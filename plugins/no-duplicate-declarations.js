const stylelint = require('stylelint')
const selectorParser = require('postcss-selector-parser')

const ruleName = '@erickmerchant/no-duplicate-declations'
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected(found) { return `Expected no duplicate declarations. Found ${found}` }
})

module.exports = stylelint.createPlugin(ruleName, (primaryOption) => {
  if (!primaryOption) return

  const found = []

  return (root, result) => {
    root.walkDecls((decl) => {
      if (decl.parent.selector) {
        const selectors = selectorParser().astSync(decl.parent.selector)

        const allPseudos = selectors.nodes.every((node) => node.nodes.some((n) => n.type === 'pseudo'))

        const str = `${decl.prop}: ${decl.value}`

        if (found.includes(str) && !allPseudos) {
          stylelint.utils.report({
            message: messages.rejected(str),
            node: decl,
            result,
            ruleName
          })
        } else {
          found.push(str)
        }
      }
    })
  }
})

module.exports.ruleName = ruleName
module.exports.messages = messages
