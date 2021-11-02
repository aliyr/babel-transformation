var babel = require('@babel/core')

const code = `
function teerg(eman) {
  return 'Hello ' + eman;
}

console.log(teerg('tanhauhau'));
`

const output = babel.transformSync(code, {
    plugins: [
        function myCoolBabelPlugin() {
            return {
                visitor: {
                    Identifier(path) {
                        if (
                            !(
                                path.parentPath.isMemberExpression()
                                &&
                                path.parentPath.get('object').isIdentifier({name: 'console'})
                                &&
                                path.parentPath.get('property').isIdentifier({name: 'log'})
                            )
                        ) {
                            path.node.name = path.node.name.split('').reverse().join('')
                        }
                    },
                    // VariableDeclaration(path) {
                    //     if (path.node.kind !== 'var') {
                    //         path.node.kind = 'var'
                    //     }
                    // },
                    StringLiteral(path) {
                        const newPath = path.node.value.split('')
                            .map(c => babel.types.StringLiteral(c))
                            .reduce((prev, curr) => {
                                return babel.types.binaryExpression('+', prev, curr)
                            })
                        path.replaceWith(newPath)
                        path.skip()
                    },
                    // NumericLiteral(path) {
                    //     console.log('NumericLiteral')
                    // }
                }
            }
        }
    ]
})

console.log(output.code)
