# module-notice
单页 各个组件 通信机制.
以及一个异步执行代码的机制处理.

每个组件可以监听某个事件, 也可以派发某个事件.
var notice = require("notice");

var funcOne = function(){
  console.log(arguments);
};
var funcTwo = function(){
  console.log(arguments);
};
notice.add("common/footer",funcOne,{msg:"before-data-one"});

notice.add("common/footer",funcTwo,{msg:"before-data-two"});

notice.dispatch("common/footer",{msg:"after-data-one"});

notice.dispatch("common/footer",{msg:"after-data-two"});

//remove one handler

notice.remove("common/footer",funcOne);

//remove one message all handler

notice.remove("common/footer");

//remove all message all handler

notice.removeAll();

//async run one functione

notice.setImmediate(function(){
  console.log("Async func");
});
console.log("1");
