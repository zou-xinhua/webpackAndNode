(
    // webpackBootstrap 启动函数
    function (modules) { // modules 为存放模块的数组
    // 已经加载过的模块，通过map的形式缓存在内存
    var installedModules = {};

    // 通过_require函数定义了一个可以在浏览器中执行的加载js文件的函数，原理同（模拟）Nodejs中的require
    function _require(moduleId) {
        // 若已经加载过，直接从缓存中返回
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // 缓存中没有，则加入缓存
        var module = installedModules[moduleId] = {
            i: moduleId,  //模块在数组中的 index
            l: false,   //是否加载标记位
            exports: {}  //导出值
        };

        // 获取当前模块的函数，传入需要的参数并调用，即加载该模块
        modules[moduleId].call(module.exports, module, module.exports, _require);
        // 修改标记位
        module.l = true;
        // 返回模块的导出值
        return module.exports;
    }
    //配置中的 publicPath，用于加载文件
    _require.p = "";

    // 从入口即index为0开始加载模块
    // _require.s = 0
    return _require(0);

})
([
    /* 0 */
    (function (module, _export, _require) {
        "use strict";
        Object.defineProperty(_export, "__esModule", {
            value: true
        });
        /* harmony import */
        var _test_js = _require(1);
        console.log(Object(_test_js["a"])('webpack'))
    }),
    /* 1 */
    (function (module, _export, _require) {
        "use strict";
        function a(name) {
            return 'hello ' + name
        }
        /* harmony default export */
        _export["a"] = (a);
    })
]);
