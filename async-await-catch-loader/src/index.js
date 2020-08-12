const parser = require("@babel/parser"); //将文件转换为AST 抽象语法树
const traverse = require("@babel/traverse").default; //深度遍历抽象语法树，找到需要的node节点
const t = require("@babel/types"); // babel版的loadsh库，和AST新的node节点相关的负载函数
const core = require("@babel/core");
const loaderUtils = require("loader-utils");

const DEFAULT = {
    catchCode: identifier => `console.error(${identifier})`,
    identifier: 'e',
    finallyCode: null
};

// 参数需要满足含有async关键字，类型包括 函数声明、箭头函数、函数表达式、方法
const isAsyncFuncNode = node =>
    t.isFunctionDeclaration(node, {
        async: true
    }) ||
    t.isArrowFunctionExpression(node, {
        async: true
    }) ||
    t.isFunctionExpression(node, {
        async: true
    }) ||
    t.isObjectMethod(node, {
        async: true
    })

module.exports = function(source) {
    console.log('source', source)
    let options = loaderUtils.getOptions(this);
    let ast = parser.parse(source, {
        sourceType: "module", // 支持 es6 module
        plugins: ["dynamicImport"] // 支持动态 import
    });
    options = {
        ...DEFAULT,
        ...options
    };
    if (typeof options.catchCode === "function") {
        options.catchCode = options.catchCode(options.identifier);
    }
    let catchNode = parser.parse(options.catchCode).program.body;
    let finallyNode =
        options.finallyCode && parser.parse(options.finallyCode).program.body;


    // 给最外层的async 函数包裹 try/catch
    traverse(ast, {
        AwaitExpression(path) {
            while(path && path.node) {
                let parentPath = path.parentPath
                if (
                    // 找到 async function
                    t.isBlockStatement(path.node) && isAsyncFuncNode(parentPath.node)
                ) {
                    // 将await节点放入try catch节点
                    let tryCatchAst = t.tryStatement(
                        path.node,
                        t.catchClause(
                            t.identifier(options.identifier),
                            t.blockStatement(catchNode)
                        ),
                        finallyNode && t.blockStatement(finallyNode)
                    )
                    path.replaceWithMultiple([tryCatchAst]) //替换节点
                    return
                } else if (t.isBlockStatement(path.node) && t.isTryStatement(parentPath.node)) {
                    return
                }
                path = parentPath
            }
        }
    });
    return core.transformFromAstSync(ast, null, {
        configFile: false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
    }).code;
}

