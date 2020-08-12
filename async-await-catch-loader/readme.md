# webpack的编译模块
编译模块是webpack流程中的核心功能。从口文件开始compilation过程。先使用配置好的loader规则对匹配的文件内容进行编译(buildModule)，从各个事件中传入的compliation回调里拿到module的resource（资源路径）、loaders等信息。再将编译好的文件内容解析成AST静态语法树，分析文件的依赖关系逐个解析依赖模块并不断递归处理

# AST是什么
抽象语法树(Abstracr Syntax Tree, AST), 是源代码语法结构的一种抽象表示。以树状的形式表现编程语言的语法结构。这里的”抽象“是指并不会表示出真实语法中出现的细节。将书写的字符串文件转换成计算机更容易识别的数据结构，表现形式为object

# loader的编写思路
1. 一个loader只做一件事情
2. 根据webpack中的配置匹配相应的文件譬如(.js .css)
3. 使用 @babel/parser 对匹配的文件内容进行解析为AST
4. 用@babel/traverse 对AST进行深度遍历，找到需要的node节点
5. 创建一个类型为 TryStatement 的节点，将上述找到的节点放入其中
6. 将需要处理节点进行替换

执行 node test/dev.js 查看运行结果
