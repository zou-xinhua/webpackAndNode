const path = require('path');


// module.exports = {
//     entry: './test/index.js',
//     output: {
//         filename: 'bundle.js',
//         path: path.resolve(__dirname, './dist'),
//     }
// };

//分割代码输出
module.exports = {
    entry: './test/split.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './split'),
    }
};
