const fs = require('fs')
const { resolve } = require('path')

function formatBytes(bytes, decimals = 2) {
    if(bytes === 0)  return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes)/Math.log(k))

    return {
        bundleSize: parseFloat((bytes / Math.pow(k, i)/k).toFixed(dm)),  //default unit is KB
        fullSizeInfo: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i]
    }
}

module.exports = class BundlesizeWebpackPlugin {
    constructor(options) {
        this.options = options || { sizeLimit: 10 }
    }
    // compiler对象
    apply(compiler) {
        console.log('from bundlesize plugin')
        // 监听compiler的done事件
        compiler.hooks.done.tap('BundleSizePlugin', (stats) => {
            const {
                path,
                filename
            } = stats.compilation.options.output // compilation对象
            const bundlePath = resolve(path, filename)
            const { size } = fs.statSync(bundlePath)
            const { bundleSize, fullSizeInfo } = formatBytes(size)
            const { sizeLimit } = this.options
            if (bundleSize < sizeLimit) {
                console.log('Safe:Bundle-size', fullSizeInfo, "\n SIZE LIMIT:", sizeLimit)
            } else if (bundleSize === sizeLimit) {
                console.warn('Warn:Bundle-size', fullSizeInfo, "\n SIZE LIMIT:", sizeLimit)
            } else {
                console.error('Unsafe:Bundle-size', fullSizeInfo, "\n SIZE LIMIT:", sizeLimit)
            }
        })
    }
}
