# Grid介绍
Grid布局将容器划分成行和列，产生一个个单元格，然后单元格放在行和列相关的位置上，grid是二维布局，具有以下特点：
1、固定的位置和弹性轨道的大小
可以用px来创建固定大小的网格，也可以用百分比或者grid的新单位fr来创建有弹性尺寸的网格
2、元素位置
可以使用行号、行名或者指定网格的区域来精确定位元素。
3、轨道
使用网格布局定义显示网格，可以根据规范处理网格外的内容。
4、对齐控制
5、控制重叠内容
多个元素可以放在单元格中，重叠的部分可以通过z-index控制优先级

# 基础概念
1、容器和项目
采用网格布局的区域，称为”容器“(container)，容器内部采用网格定位的子元素即为”项目“。通过在元素上声明 display: grid 或 display: inline-grid 创建网格容器。该元素的直系子元素将成功网格项目

```
<div class="container">
    <div class="one"></div>
    <div class="two></div>
</div>
/* 容器 */
.container{
    /* 声明容器 */
    display: grid;
    /* 列的宽度 */
    grid-template-columns: repeat(3, 200px);
    /* 行的高度 */
    grid-template-rows: 100px 200px;
    /* 行、列的间距 */
    grid-gap: 20px;
}
/* 项目 */
.one .two {

}
```
2、网格轨道
通过 grid-template-columns 和 grid-template-rows 属性来定义网格中的行和列，可以类似理解为表格中的行和列。

3、网格单元
网格单元是网格元素中的最小单位，行和列的交叉位置形成网格单元，类似表格中的单元格。

4、网格线
划分网格的线，水平网格线划分出行，垂直网格线划分出列。n行有n+1根水平网格线m列有m+1根垂直网格线

# 容器属性
1、display: grid （块级元素） 或 display: inline-grid （行内元素）
设为网格布局后，容器子元素（项目）的float、display: inline-block、display:table-cell、vertical-align和column-*等设置都将失效
2、grid-template-columns属性，grid-template-rows属性
分别设置列宽和行高，其中还支持如下属性：
- 2.1、固定的宽和行高
- 2.1、fr
    Grid布局引入了新的长度单位来创建灵活的网格轨道，代表网格容器中可用空间的一等份。可以方便的表示比例关系，如果两列的宽度分别为1fr、2fr，就表示后者是前者的两倍
    ```
    .container {
    display: grid;
    grid-template-columns: 150px 1fr 2fr;
    }
    ```
    这个例子表示第一列的宽度为150px，第二列的宽度是第三列的一半
- 2.2 repeat()函数
    可以简化重复的值。接受2个参数，一个是重复的次数，第二是要重复的值，譬如
    ```
    .container {
        display: grid;
        grid-template-columns: repeat(3, 100px)
    }
    ```
- 2.3 auto-fill
    单元格的大小是固定的，但是容器的大小不确定。auto-fill 自动填充，让一行（或者一列）中尽可能的容纳更多的单元格，grid-template-columns: repeat(auto-fill, 200px)，表示列宽是200px，但是列的数量不固定，只要容纳得下，就可以放置元素
- 2.4 minmax()函数
    minmax()产生一个长度范围，表示长度在这个范围中，接受最大值、最小值 两个参数
    ```
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr minmax(300px, 2fr);
    }
    ```
- 2.5 auto
    auto表示长度由浏览器自己决定，可以一行代码实现两栏、三栏布局
    ```
    .container {
        display: grid;
        grid-template-columns: 100px auto 100px;
    }
    ```
3、grid-gap以及grid-row-gap、grid-column-gap属性
grid-row-gap、grid-column-gap 分别设置行间距和列间距，grid-gap是两者的简写形式
4、grid-template-areas
用于定义区域，一个区域由一个或者多个单元格组成。跟网格元素的grid-area一起使用。grid-area属性指定项目放在哪个区域
```
.container{
    display: grid;
    grid-template-columns: 200px auto;
    grid-template-rows: auto;
    grid-template-areas:'header header header'
                        'sidebar content content';
}
.sidebar{
    grid-area: sidebar;
}
```
5、grid-auto-flow
该属性设置网格单元的放置顺序，默认是”先行后列“，先填满一行再开始放后面的行。可以设置为row或者column，还有一个dense属性，配合使用，grid-auto-flow: row dense 表示先排行，并尽量排满不留空格
6、justify-items、align-items、place-items
justify-items属性设置单元格内容的水平位置（左中右），align-items设置单元格的垂直位置（上中下）
```
.container{
    justify-items: start | end | center | stretch
    align-items: start | end | center | stretch
}
```
写法相同，并都可以取下面的值：
- start: 对齐单元格的起始边缘
- end: 对齐单元格的结束边缘
- center: 单元格内部居中
- stretch: 拉伸，占满单元格的整个宽度
place-items是align-items、justify-items的合并简写形式， place-items: <align-items><justify-items>
7、justify-content、align-content、place-content
表示整个内容区域在容器里的水平或垂直位置
```
.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;
}
```
同上，place-content是align-content与justify-content的简写形式
8、grid-auto-columns、grid-auto-rows属性
用来设置浏览器自动创建的多余网格的列宽和行高，写法与grid-template-columns和grid-template-rows完全相同。

# 项目属性
1、项目位置属性
grid-column-start： 左边框所在的垂直网格线
grid-column-end：右边框所在的垂直网格线
grid-row-start：上边框所在的水平网格线
grid-row-end：下边框所在的水平网格线
```
.item{
    grid-column-start: 2;
    grid-column-end: 4;
}
```
指定左边框是第二根垂直网格线，右边框是第四根垂直网格线

grid-column属性是grid-column-start和grid-column-end的合并简写形式，grid-row是grid-row-start和grid-row-end的合并简写形式

2、grid-area属性
指定项目放在哪个区域

3、justify-self、align-self、place-self
justify-self属性设置单元格的水平位置类似于justify-items，只是作用于单个项目。align-self设置单元格内容的垂直位置，同样类似于align-items，只是作用于单个项目

# 实现响应式布局
1、多栏响应式布局
```
.wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 120px auto 120px;
    grid-template-areas:
    "header header header"
    "sidebar content sidebar2"
    "footer footer footer";
}
.sidebar{
    grid-area: sidebar;
}
.sidebar2{
    grid-area: sidebar2;
}
.content{
    grid-area: content;
}
.header{
    grid-area: header;
}
.footer{
    grid-area: footer;
}

<div class="wrapper">
    <div class="box header">Header</div>
    <div class="box sidebar">Sidebar</div>
    <div class="box sidebar2">Sidebar2</div>
    <div class="box content">Content</div>
    <div class="box footer">Footer</div>
</div>
```
2、等分响应式布局
```
.wraper{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px 20px;
    grid-auto-rows: 50px;
}
```
