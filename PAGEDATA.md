# pageData 对页面数据的相关操作
因为所有js都是通过 module 包装了的。所以没法有效的获得页面的数据。所有widget只有init的时候才可能拿到他自己所需要的data。
但也只有这一次能拿到。 以后再也无法拿到。

**PS:重点**   
虽然每个widget可以把第一次拿到的data给引用后缓存下来。但这样是不安全的,因为对象为引用。如果一个修改后，另外一个widget也会受到影响。如果第一次拿到数据后 通过 $.extend(true,{},data) 的形式进行深拷贝。那么以后就无法再次拿到最新的页面数据。

**所以。这里规定。**    
widget 不能修改数据。并且除了第一次 init 时的数据用来渲染页面外。后面如果想要数据就必须通过 get来获取。widget 绝对不能调用 store。只能调用 get。为了保证数据的单项流动(好处可自行去了解flux),如果一些操作需要修改数据, 则应该widget 发出一个事件,在page中响应该事件,page中进行修改数据的操作。page 做为所有widget的调度中心。数据的相关操作,只能在page中进行。

### 例子
```js
var pageData = require("static/pageData");
var data = {
	"people":{
		"name":"lgd",
		"sex" :"boy",
		"age" : 18
	},
	"imgList":[
		"111111",
		"222222",
		"333333",
	]
};

var widget = {
	"list/main"   : "imgList",
	"people/name" : "people.name",
};
pageData.store(data,widget);

console.log(pageData.get("list/main"));
// 输出 data.imgList

console.log(pageData.get("people/name"));
// 输出 lgd

console.log(pageData.get());
// 输出 整个data

data.people.name = "sss";
data.people.sex = "girl";
data.people.age = 19;
pageData.store(data); //存储一个新的数据

```