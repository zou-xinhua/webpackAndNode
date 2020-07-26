(function(modules) { // webpackBootstrap
	// webpackJsonp 挂载到全局方便安装，用于异步加载文件模块
    var parentJsonpFunction = window["webpackJsonp"];
    /**
     * @param {Array} chunkIds 需要加载的模块的chunk ID
     * @param {Array} moreModules 需要加载的模块列表
     * @param {Array} executeModules  需要加载的模块安装成功之后，需要执行的模块的index
     */
	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
        // 将所有chunkIds 对应的模块标记为加载成功
		var moduleId, chunkId, i = 0, resolves = [], result;
		for(;i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			if(installedChunks[chunkId]) {
				resolves.push(installedChunks[chunkId][0]);
			}
			installedChunks[chunkId] = 0;
        }
		// 将moreModules 添加到 modules对象中
		for(moduleId in moreModules) {
			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId];
			}
		}
		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
		while(resolves.length) {
			resolves.shift()();
		}
	};
	// 缓存
	var installedModules = {};
	// 存储chunk的加载状态，key为chunk的ID，值为0代表加载成功
	var installedChunks = {
		1: 0
	};
	// 模拟require语句，和上面一致
	function _require(moduleId) {
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};
		modules[moduleId].call(module.exports, module, module.exports, _require);
		module.l = true;
		return module.exports;
	}
	// 用于加载被分割， 需要异步加载的chunkId对应的文件
	_require.e = function requireEnsure(chunkId) {
        //获取需要加载chunk的状态
        var installedChunkData = installedChunks[chunkId];
        //成功加载则直接返回
		if(installedChunkData === 0) {
			return new Promise(function(resolve) { resolve(); });
		}
		//有值但是不为0表示加载中
		if(installedChunkData) {
			return installedChunkData[2];
		}
		//状态为空，则去加载相应chunk对应的文件
		var promise = new Promise(function(resolve, reject) {
            debugger
			installedChunkData = installedChunks[chunkId] = [resolve, reject];
		});
		installedChunkData[2] = promise;

        // 操作DOM，向head中插入script标签
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.charset = 'utf-8';
		script.async = true;
		script.timeout = 120000;
		if (_require.nc) {
			script.setAttribute("nonce", _require.nc);
        }
        //文件路径为publicPath、chunkID拼接起来
        script.src = _require.p + "" + chunkId + ".bundle.js";
        //设置2分钟之后调用的定时器
        var timeout = setTimeout(onScriptComplete, 120000);
        // script加载完成时回调
        script.onerror = script.onload = onScriptComplete;
		function onScriptComplete() {
			// 防止循环调用，内存泄漏
			script.onerror = script.onload = null;
            clearTimeout(timeout);
            // 检查对应的chunk是否安装成功，0为成功
			var chunk = installedChunks[chunkId];
			if(chunk !== 0) {
				if(chunk) {
					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
				}
				installedChunks[chunkId] = undefined;
			}
		};
		head.appendChild(script);
		return promise;
	};

	// 加载路径
	_require.p = "";
	// 加载并执行入口
	return _require(_require.s = 0);
})
(
    // 没有经过异步加载，随着入口文件加载的模块
    [
        /* 0 */
        (function(module, exports, _require) {
            // 异步加载 test.js
            _require.e/* import() */(0).then(_require.bind(null, 1)).then((a) => {
                // 执行 a 函数
                console.log(a.default('webpack'))
            });
        })
    ]
);
