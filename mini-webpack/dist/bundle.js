(function(graph){
            console.log(graph)
            // 重写require函数
            function require(module){
                console.log(module)
                // 找到对应modulId依赖对象，调用require函数，eval执行，拿到exports对象
                function localRequire(relativePath){
                return require(graph[module].dependecies[relativePath])
                }
                // 定义exports对象
                var exports = {};
                (function(require,exports,code){
                    // commonjs语法使用module.exports暴露实现
                    eval(code)
                })(localRequire,exports,graph[module].code)
                return exports;
            }
            require('./test/index.js')
            })({"./test/index.js":{"dependecies":{"./test.js":"./test/test.js"},"code":"\"use strict\";\n\nvar _test = _interopRequireDefault(require(\"./test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_test[\"default\"]);"},"./test/test.js":{"dependecies":{"./message.js":"./test/message.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _message = _interopRequireDefault(require(\"./message.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nvar a = 'hello ' + _message[\"default\"];\nvar _default = a;\nexports[\"default\"] = _default;"},"./test/message.js":{"dependecies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar b = 'world';\nvar _default = b;\nexports[\"default\"] = _default;"}})
