# flex的基本概念
flex是一维布局，给子元素提供了强大的空间分布和对齐能力。作为对比的是二维布局grid，可以同时处理行和列上的布局
1、主轴
由flex-direction定义，可以有4个值
row、row-reverse: 主轴为水平方向延伸
column、column-reverse: 主轴为垂直方向延伸
2、交叉轴
交叉轴垂直于主轴，如果flex-direction（主轴）设成了row或者row-reverse，交叉轴就是垂直方向
3、起始线和终止线
之前css的书写模式主要是水平的，从左到右，在flex中可以设置元素起始位置和终止位置和方向

# 容器属性
flex布局需要先指定一个容器，任何一个容器都可以被指定为flex布局
```
.container{
    display: flex | inline-flex;  //可以有2种取值，分别对应于块元素和行内元素
}
```
设置flex布局之后，子元素的float、clear、vertical-align等属性将会失效

flex容器有6个属性：
1、flex-direction: 决定主轴的方向（即项目的排列方向）
```
.container{
    flex-direction: row | row-reverse | column | column-reverse
}
```
默认为row，主轴为水平方向，起点在左端。其余依次类推
2、flex-wrap: 决定容器内项目是否可换行
.container{
    flex-wrap: nowrap | wrap | wrap-reverse
}
默认值：nowrap不换行，当父容器尺寸固定，空间不足时，项目尺寸会随之调整而并不会挤到下一行
wrap: 父容器空间不足时换行，第一行在上方
wrap-reverse: 第一行在下方
3、flex-flow：flex-direction和flex-wrap的简写形式
4、justify-content: 项目在主轴的对齐方式
```
.container{
    justify-content: flex-start | flex-end | center | space-between | space-around;
}
```
flex-start (默认值)：左对齐
flex-end: 右对齐
center：居中
space-between: 两端对齐，项目之间的间隔都相等
space-around: 每个项目两侧的间隔相等，因而项目之间的间隔比项目与边框的间隔大一倍
5、align-items：定义项目在交叉轴上的对齐方式
flex-start: 交叉轴的起点对齐
flex-end: 交叉轴的终点对齐
center: 交叉轴的中点对齐
baseline：项目的第一行文字的基线对齐
stretch（默认值）: 如果项目未设置高度或设为auto，将占满整个容器的高度
6、align-content多根轴线的对齐方式，如果项目只有一根，将不起作用
同上，只不过都相对于交叉轴进行对齐

# 项目属性
有6个属性设置在项目上， order、flex-grow、flex-shrink、flex-basis、flex、align-self
1、order
定义项目的排列顺序，数值越小越靠前，默认为0
2、flex-grow
定义项目的放大比例，默认为0，即使存在剩余空间也不放大
3、flex-shrink
项目的缩小比例，默认为1
4、flex-basis
在分配多余空间之前，项目占据的主轴空间，默认为auto
5、flex
flex-grow、flex-shrink、flex-basis的简写，默认值为0 1 auto
还有快捷值：auto (1 1 auto) 和 none （0 0 auto）
有以下特殊情况，可以如下进行划分：
当flex取值为一个非负数字，则该数字为flex-grow值，flex-shrink取1，flex-basis 取 0%，下面是等同的
```
.item { flex: 2 }
.item{
    flex-grow: 2;
    flex-shrink: 1;
    flex-basis: 0%;
}
```
当flex取值为一个长度或百分比，则将其作为flex-basis值，flex-grow和flex-shrink分别为1
```
.item{ flex: 24px }
.item{
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 24px;
}

.item{ flex: 0% }
.item{
    flex-grow: 1;
    flex-shrink:1;
    flex-basis: 0%;
}
```
当flex取2个非负数字，则分别是flex-grow和flex-shrink的值
```
.item{ flex: 2 3; }
.item{
    flex-grow: 2;
    flex-shrink: 3;
    flex-basis: 0%;
}
```
flex取值为一个非负数字和一个长度或者百分比，则分别作为flex-grow和flex-basis的值，flex-shrink为1
```
.item{ flex: 11 22px }
.item{
    flex-grow: 11;
    flex-shrink: 1;
    flex-basis: 22px;
}
```
6、align-self
align-self允许单个项目有与其他项目不一样的对齐方式，可覆盖algin-items属性，默认继承父容器的algin-items属性，若没有父容器则为stretch

# flex-grow与flex-shrink的计算
1、flex-grow的计算方式
flex-grow属性决定了父元素在空间分配上还有剩余空间时，如何分配这些剩余空间，其值为一个权重（扩张因子），默认为0，剩余空间根据这个值来分配。若子元素的flex-grow设置为1，它就可以占满水平剩余空间。
譬如剩余空间为x，三个元素的flex-grow分别为a，b，c，子元素的扩展因子总和sum为a+b+c。三个元素得到的剩余空间分别是x*a/sum, x*b/sum, x*c/sum，是各自扩张的权重。
举例：
父元素的宽度500px，三个子元素的width值分别为100px, 150px, 100px，于是剩余空间为150px
三个元素的flex-grow分别为1，2，3，sum为6，则各自的扩张倍数为1/6、2/6，3/6
扩张的空间分别为 150*1/6 = 25px ，150*2/6 = 50px ，150*3/6 = 75px
三个元素最终的宽度分别为 100px + 25px = 125px ， 150px + 50px = 200px ， 100px + 75px = 175px

还有一种为小数的情况：
当所有元素的flex-grow之和小于1的时候，sum将不是总和而是1，即所有元素的flex-grow之和小于1的时候，剩余空间不会全部分配给各个元素。
同上的例子，但是元素的flex-grow分别是0.1、0.2、0.3，那么计算公式将变为：
150*0.1/1 = 15px  150*0.2/1 = 30px 150*0.3/1 = 45px
150px - 15px - 30px - 45px = 60px，还有60px没有分配给任何元素
三个元素的最终宽度分别为：100px + 15px = 115px ，150px + 30px = 180px ， 100px + 45px = 145px

flex-grow会受到max-width影响，如果最终扩展后的宽度大于max-width指定的值，则max-width优先。同样会导致父元素有部分剩余空间未分配

2、flex-shrink的计算方式
flex-shrink定义容器空间不够时各个子元素如何收缩，默认值为1，其定义的是元素宽度变小的权重分量。每个元素具体收缩多少，还有另一个重要因素，即它的宽度。
举例：
父元素的width值为500px，三个子元素分别设置为150px，200px，300px，三个子元素的flex-shrink的值分别为1，2，3
子元素的溢出值为 500 - （150 + 200 + 300） = -150，三个元素总共需收缩150
具体的计算方式为：每个元素收缩的因子为各自的flex-shrink乘以各自的宽度
sum = 1*150 + 2*200 + 3*300 = 1450
三个元素的收缩系数分别为： 1*150/1450  2*200/1450  3*300/1450
三个元素分别收缩： 150*1(flex-shrink)*150(width)/1450 = -15.5  150*2(flex-shrink)*200(width)/1450 = -41.4  150*3(flex-shrink)*300(width)/1450 = -93.1
三个元素的最终宽度分别为： 150 - 15.5 = 134.5  200 - 41.4 = 158.6  300 - 93.1 = 206.9

同上，当所有元素的flex-shrink之和小于1时，计算方式也会不同。并不会收缩所有的空间，只会收缩flex-shrink之和相对于1的比例空间
三个元素的flex-shrink分别为0.1、0.2、0.3，则收缩的总权重为145，每个元素收缩的空间为：
90*0.1(flex-shrink)*150(width)/145 = 9.31 , 90*0.2(flex-shrink)*200(width)/145 = 24.83 , 90*0.3(flex-shrink)*300(width)/145 = 55.86
三个元素的最终宽度为：
150 - 9.31 = 140.69 、 200 - 24.83 = 175.17 、 300 - 55.86 = 244.14

flex-shrink也会受到min-width的影响


总结以上，flex-grow的扩张系数由自身设置的权重决定，两者比例相同。flex-shrink的收缩系数由自身设置的权重和自身宽度决定，两者的乘积为最终的权重。
