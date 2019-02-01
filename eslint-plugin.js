module.exports = {
  rules: {
    'no-func-keyword': {
      create(context) {
        const noFuncKeyword = (node) => {
          if (!node.generator && node.parent.type !== 'Property') {
            context.report(node, 'Use an arrow function instead')
          }
        }

        return {
          FunctionExpression: noFuncKeyword,
          FunctionDeclaration: noFuncKeyword
        }
      }
    }
  }
}
