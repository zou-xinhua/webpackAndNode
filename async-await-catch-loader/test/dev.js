const compiler = require("./compiler.js");

(async () => {
    //函数声明
    const stats1 = await compiler("test1.js");
    const output1 = stats1.toJson().modules[0].source;
    console.log('output1', output1)

    //已有try catch
    const stats2 = await compiler("test2.js");
    const output2 = stats2.toJson().modules[0].source;
    console.log('output2', output2)

    //箭头函数
    const stats3 = await compiler("test3.js");
    const output3 = stats3.toJson().modules[0].source;
    console.log('output3', output3)

    //函数表达式
    const stats4 = await compiler("test4.js");
    const output4 = stats4.toJson().modules[0].source;
    console.log('output3', output4)

    //方法
    const stats5 = await compiler("test5.js");
    const output5 = stats5.toJson().modules[0].source;
    console.log('output3', output5)
})()

