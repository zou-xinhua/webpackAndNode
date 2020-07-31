# plugin
webpack源码中80%的功能都是通过plugin实现的。通过plugin，webpack更加灵活，以适应各种应用场景。在webpack的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果
webpack在 初始化阶段、编译阶段、输出阶段 （compiler, compilations and parser）提供钩子函数，使用插件监听钩子函数，然后执行相应操作
webpack插件组成:
- 一个JavaScript函数或者class
- 在它的原型上定义一个apply方法
- 指定挂载的webpack事件钩子
- 处理webpack内部实例的特定数据
- 功能完成后调用webpack提供的回调

```
class MyPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('hello world plugin', (
            stats // 当事件触发的时候，可以获取到stats参数
        ) => {
            console.log('hello world')
        })
    }
}
```
<b>apply</b>
每一个webpack plugin都有apply方法，然后通过webpack调用，并且提供compiler实例作为相应方法的参数

# Tapable
webpack整体是一个插件架构，所有的功能都以插件的方式继承在构建流程中，通过发布订阅事件来触发各个插件执行。tapable类似于NodeJS的EventEmitter类，用于自定义事件的发现和操作
其中最重要的2个核心函数
- compiler（编译器）
compiler对象中有完整的webpack环境配置。在启动webpack，即run方法的时候，配置好了options、loader、plugin等设置。
代表不变的webpack配置环境
- compilation（编译）
compilation对象表示一次资源版本构建信息，运行中检测到文件变化就会创建新的compilation，从而生成一组新的编译资源。compilation对象中有当前模块的资源、编译生成资源、变化的文件、以及跟踪依赖的状态信息等
针对随时可变的项目文件，文件改动，compilation就会被重新创建


