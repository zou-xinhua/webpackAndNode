# CommonJS
CommonJS是一种规范，通过简单的API声明服务器的模块，目标是让JS可以运行在浏览器之外的地方，譬如服务器或者本地桌面应用程序上
规范如下：
- 规定模块的标识应该遵循的规则
- 定义全局函数require，通过传入模块标志来引入其他模块，执行结果是其他模块暴露出的API
- 若require函数引入的模块中也包含依赖，则依次加载这些依赖
- 若引入模块失败，则抛异常
- 模块通过exports变量向外暴露API，exports只能是一个对象，暴露的API必须作为此对象的属性

# NodeJS与CommonJS
Node在模块方面遵循了CommonJS规范，两者的区别主要是在exports对象的具体实现上
原生nodejs中，module.exports是真正对外暴露的接口，但是commonjs规范中规定exports是暴露的接口对象，为了兼容适配，node增加了将exports关键字绑定到module.exports对象上的默认操作，即export默认指向了module.exports导出的对象。

# 模块的核心
Node运用2个核心模块来管理模块依赖，全局模块 require和module，不需要单独引入
```
const example = require('/example')
```
上面的加载一个模块语句，Node依次通过了下面步骤的处理：
- Resolving（解析）：通过解析获取到模块文件的绝对路径
- Loading（加载）：判断文件内容的类型
- Wrapping（包裹）：给加载的文件加上私有作用域，以便require和module对象可以正确指向我们加载的任何文件
- Evaluating（评估）：内存最终对加载的代码执行的操作
- Caching（缓存）：当再次require这个文件的时候，不需要花费时间重复上面的步骤

下面结合例子解释上面的不同阶段，以及它们如何影响我们在node中编写模块

## 解析

### 解析本地路径
node环境执行module命令，查看module对象
```
➜  example git:(master) ✗ node
> module
Module {
  id: '<repl>',
  path: '.',
  exports: {},
  parent: undefined,
  filename: null,
  loaded: false,
  children: [],
  paths: [...]
}
```
每一个模块对象有唯一id标志对象，id通常是文件的完全路径
Node 模块在文件系统上有一对一的关系。通过加载文件的内容到内存实现require一个module
但是，Node 支持很多种加载文件的方式（相对路径、绝对路径或者预置路径等），找到文件的绝对路径是加载文件的前提
当执行
```
require('/example-path')
```
node将会在所有的模块path里依次寻找，包括根目录下各个目录的node_modules
```
> module.paths
[
  '/Users/zxh/Documents/node/module/example/repl/node_modules',
  '/Users/zxh/Documents/node/module/example/node_modules',
  '/Users/zxh/Documents/node/module/node_modules',
  '/Users/zxh/Documents/node/node_modules',
  '/Users/zxh/Documents/node_modules',
  '/Users/zxh/node_modules',
  '/Users/node_modules',
  '/node_modules',
  '/Users/zxh/.node_modules',
  '/Users/zxh/.node_libraries',
  '/Users/zxh/.nvm/versions/node/v12.9.1/lib/node'
]
```
在以上目录都没有example-path.js文件，则会报错
```
> require('/example-path')
Thrown:
Error: Cannot find module '/example-path'
Require stack:
- <repl>
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:772:15)
    at Function.Module._load (internal/modules/cjs/loader.js:677:27)
    at Module.require (internal/modules/cjs/loader.js:830:19)
    at require (internal/modules/cjs/helpers.js:68:18) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '<repl>' ]
}
```
创建一个文件看看
```
➜  example git:(master) ✗ echo "console.log('find');" > node_modules/example-path.js
➜  example git:(master) ✗ node
Welcome to Node.js v12.9.1.
Type ".help" for more information.
> require('example-path')
find
{}
>
```
如果有一个相同的文件存在上一级目录，但是依然在当前目录下引用文件，依然会加载当前目录下的文件。但是如果把当前目录的文件删除，则上一级目录下的文件会生效

```
➜  example git:(master) ✗ mkdir ../node_modules
➜  example git:(master) ✗ echo "console.log('I am the root of example');" > ../node_modules/example-path.js
➜  example git:(master) ✗ node
Welcome to Node.js v12.9.1.
Type ".help" for more information.
> require('example-path')
find
{}
>
➜  example git:(master) ✗ rm -r node_modules/
➜  example git:(master) ✗ node
Welcome to Node.js v12.9.1.
Type ".help" for more information.
> require('example-path')
I am the root of example
{}
>
```
### 解析文件夹
模块也不仅仅是文件，下面创建一个文夹，并加载这个文件夹，require('example-path')将会默认指向文件夹的index.js文件，但是我们可以通过设置package.json中的main属性来设置指向文件夹中的哪个文件
```
// 默认
➜  example git:(master) ✗ mkdir -p node_modules/example-path
➜  example git:(master) ✗ echo "console.log('in folder');" > node_modules/example-path/index.js
➜  example git:(master) ✗ node
Welcome to Node.js v12.9.1.
Type ".help" for more information.
> require('example-path')
in folder
{}

// 通过设置package的main
➜  example git:(master) ✗ echo "console.log('this is main')" > node_modules/example-path/start.js
➜  example git:(master) ✗ echo '{ "name": "example-path-folder", "main": "start.js" }' > node_modules/example-path/package.json
➜  example git:(master) ✗ node
Welcome to Node.js v12.9.1.
Type ".help" for more information.
> require('example-path')
this is main
{}
```
### require.resolve
在需要判断一个可选的模块是否存在，仅在存在的时候进行使用。或者只需要解析模块并不需要执行，就可以通过require.resolve来处理。和require的处理相似，但是不加载文件。
```
> require.resolve('example-path')
'/Users/zxh/Documents/node/module/example/node_modules/example-path/start.js'
> require.resolve('example-path-not')
Thrown:
Error: Cannot find module 'example-path-not'
Require stack:
- <repl>
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:772:15)
    at Function.resolve (internal/modules/cjs/helpers.js:74:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '<repl>' ]
}
```
### 相对和绝对路径
除了从node_modules里解析模块，也可以指定相对路径（./ ../）和绝对路径（/）

### 文件直接的父子关系
通过创建2个文件，在文件中打印模块信息
```
➜  example git:(master) ✗ mkdir lib
➜  example git:(master) ✗ echo "console.log('in util', module)" > lib/util.js
➜  example git:(master) ✗ echo "console.log('in index', module); require('./lib/util');" > index.js
➜  example git:(master) ✗ node index.js
in index Module {
  id: '.',
  path: '/Users/zxh/Documents/node/module/example',
  exports: {},
  parent: null,
  filename: '/Users/zxh/Documents/node/module/example/index.js',
  loaded: false,
  children: [],
  paths: [...]
}
in util Module {
  id: '/Users/zxh/Documents/node/module/example/lib/util.js',
  path: '/Users/zxh/Documents/node/module/example/lib',
  exports: {},
  parent: Module {
    id: '.',
    path: '/Users/zxh/Documents/node/module/example',
    exports: {},
    parent: null,
    filename: '/Users/zxh/Documents/node/module/example/index.js',
    loaded: false,
    children: [ [Circular] ],
    paths: [...]
  },
  filename: '/Users/zxh/Documents/node/module/example/lib/util.js',
  loaded: false,
  children: [],
  paths: [...]
}
```
index模块（即id: '.'）作为lib/util的父模块， [Circular]表示循环引用，即当前的lib/util模块
如果lib/util模块引用index模块，是什么情况呢

### exports
模块里的exports是一个特殊的对象，上面每次打印出modules对象时，都输出的是空对象。可以添加任何属性到这个对象。譬如可以添加id属性或者方法到index和lib/util
exports是指向module.exports（管理着导出的属性）的引用。对exports重新赋值，前面的引用就会丢失。可以通过exports.test = 'a'这样来导出一个对象，但是不能直接对exports进行赋值
```
In index Module {
  id: '.',
  exports: {id: 'index'},
  loaded: false,
  ... }

In index Module {
  id: '.',
  exports: [Function],
  loaded: false,
  ... }
// 错误写法
exports = {
  a: 1, b:2
}
// 正确写法
modules.exports = {
  a: 1, b: 2
}
```
发现上面module的信息里都有loaded属性，上面的例子中loaded属性都为false。module模块通过loaded属性标志模块是否被加载或者正在加载。譬如，通过把index模块里的内容放在setImmediate里面调用，这个模块在下一次事件循环的时候就会被全部加载。exports对象在结束加载模块的时候会变得复杂，整个require/loading模块的过程是同步的，所以在一次事件循环之后可以看到模块被全部加载。同时意味着不能在异步处理中修改exports对象
```
setImmediate(() => {
    console.log('index module is loaded', module)
})

➜  example git:(master) ✗ node index.js
index module is loaded Module {
  id: '.',
  path: '/Users/zxh/Documents/node/module/example',
  exports: {},
  parent: null,
  filename: '/Users/zxh/Documents/node/module/example/index.js',
  loaded: true,
  children: [],
  paths: [...]
}
```
### 模块循环依赖
当module1和module2相互依赖会出现什么呢。通过下面例子发现module2会在module1之前加载，module2依赖的module1没有完全加载，从这里可以看出export的属性在循环依赖之前，只有a属性打印的原因是因为b和c在module2之后导出，然后输出module1的内容。改变module1中加载moudule2的位置，可以发现输出的内容不同

```
//module1.js
exports.a = 1

require('./module2')

exports.b = 2
exports.c = 3

//module2.js
const Module1 = require('./module1')
console.log('Module1 is partially loaded here', Module1)

➜  example git:(master) ✗ node lib/module1.js
Module1 is partially loaded here { a: 1 }

exports.a = 1
exports.b = 2
exports.c = 3
require('./module2')

➜  example git:(master) ✗ node lib/module1.js
Module1 is partially loaded here { a: 1, b: 2, c: 3 }
```
### JSON and C/C++ 模块
可以直接引用 json 文件或者c++ 模块，也可以不加文件后缀。如果加载的文件没有后缀，则会依次通过.js > .json > .text > .node 为了避免名称重复导致的冲突，最好除了js文件都加上后缀。
通过下面输出各个后缀文件的处理方法，发现nodejs对不同模块有不同的处理。对于.js文件用module._complie，.json文件使用JSON.parse，.node文件使用process.dlopen
```
➜  example git:(master) ✗ node
> require.extensions
[Object: null prototype] {
  '.js': [Function],
  '.json': [Function],
  '.node': [Function],
  '.mjs': [Function]
}
> require.extensions['.js'].toString()
'function(module, filename) {\n' +
  "  const content = fs.readFileSync(filename, 'utf8');\n" +
  '  module._compile(stripBOM(content), filename);\n' +
  '}'
> require.extensions['.json'].toString()
'function(module, filename) {\n' +
  "  const content = fs.readFileSync(filename, 'utf8');\n" +
  '\n' +
  '  if (manifest) {\n' +
  '    const moduleURL = pathToFileURL(filename);\n' +
  '    manifest.assertIntegrity(moduleURL, content);\n' +
  '  }\n' +
  '\n' +
  '  try {\n' +
  '    module.exports = JSON.parse(stripBOM(content));\n' +
  '  } catch (err) {\n' +
  "    err.message = filename + ': ' + err.message;\n" +
  '    throw err;\n' +
  '  }\n' +
  '}'
> require.extensions['.node'].toString()
'function(module, filename) {\n' +
  '  if (manifest) {\n' +
  '    const content = fs.readFileSync(filename);\n' +
  '    const moduleURL = pathToFileURL(filename);\n' +
  '    manifest.assertIntegrity(moduleURL, content);\n' +
  '  }\n' +
  "  // Be aware this doesn't use `content`\n" +
  '  return process.dlopen(module, path.toNamespacedPath(filename));\n' +
  '}'
> require.extensions['.mjs'].toString()
'function(module, filename) {\n  throw new ERR_REQUIRE_ESM(filename);\n}'
```
### 在nodejs中的代码都会包裹上相应的方法
再次回顾下exports和module.exports的关系，可以通过exports对象导出属性，但是不能直接对exports赋值，因为它是指向module.exports的。那为什么是这样的呢？
在浏览器中我们定义一个变量譬如let a = 1; a这个变量在定义之后，就可以在全局中可以获取（暂不考虑函数和作用域等）。但是在nodejs中，在一个模块中定义一个变量，在同一个应用下的别的模块访问不到这个变量。那nodejs中的变量是怎样进行作用域限制的呢

在编译一个模块之前，node会在一个方法里使用module方法中的wrapper方法包裹模块的代码. node 不会直接执模块中的代码，而是将它放在wrapper方法的body中，通过这样保证模块中的变量的作用域在当前模块
```
> require('module').wrapper
Proxy [
  [
    '(function (exports, require, module, __filename, __dirname) { ',
    '\n});'
  ],
  { set: [Function: set], defineProperty: [Function: defineProperty] }
]
```
wrapper方法有5参数 exports, require, module, __filename, __dirname
exports就是module.exports, 所以在模块中可以直接使用exports和require, moduel是当前模块的信息, __filename、__dirname分别是当前模块的绝对文件名和路径

```
➜  example git:(master) ✗ node test.js
[Arguments] {
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: Module {
      id: '.',
      path: '/Users/zxh/Documents/node/module/example',
      exports: {},
      parent: null,
      filename: '/Users/zxh/Documents/node/module/example/test.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function],
      '.json': [Function],
      '.node': [Function],
      '.mjs': [Function]
    },
    cache: [Object: null prototype] {
      '/Users/zxh/Documents/node/module/example/test.js': [Module]
    }
  },
  '2': Module {
    id: '.',
    path: '/Users/zxh/Documents/node/module/example',
    exports: {},
    parent: null,
    filename: '/Users/zxh/Documents/node/module/example/test.js',
    loaded: false,
    children: [],
    paths: [...]
  },
  '3': '/Users/zxh/Documents/node/module/example/test.js',
  '4': '/Users/zxh/Documents/node/module/example'
}
```
### 模块缓存
缓存对文件来说很重要，通过缓存，重复加载同一个文件时可以减少加载时间。通过查看require.cache，发现缓存是一个对象，每个属性指向一个模块
```
> require.cache
[Object: null prototype] {}
```


