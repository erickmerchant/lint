module.exports = {
  rules: {
    'no-functions': {
      create(context) {
        const noFunction = (node) => {
          if (!node.generator && node.parent.type !== 'Property') {
            context.report(node, 'Use an arrow function instead')
          }
        }

        return {
          FunctionExpression: noFunction,
          FunctionDeclaration: noFunction
        }
      }
    }
  }
}
