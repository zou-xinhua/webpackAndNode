// 异步加载 test.js
import('./test.js').then((a) => {
    // 执行 test 函数
    console.log(a.default('webpack'))
});
