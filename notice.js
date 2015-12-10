/*
create by liuguodong 15/10/14
事件监听机制
*/
/*
自定义事件(customEvent ,caniuse 上可查看) 的支持性还没 window.postmessage 好。
所以异步触发采用 postMessage 和 setTimeout
*/
;(function(window, undefined){

/***************************
listener = {
	"common/page" : {
		*funcId* : {
			func: callBack,
			data: addData
		}
	}
}
***************************/
var listener = {};
var funcIdKey = String(Math.random())+"listenerID";
var setImmediateQueue = {};

function dispatch (msgName,data) {
	if(!checkMsgName(msgName)){
		return false;
	}
	var msgObj = listener[msgName];
	var item = null;
	for(var i in msgObj){
		item = msgObj[i];
		item["func"](data,item["data"]);
	}
}
function add (msgName,callBack,data) {
	if(!checkMsgName(msgName)){
		return false;
	}
	if(!checkFuncName(callBack) ){
		return false;
	}

	var msgObj = null;
	var funcId = callBack[funcIdKey];// 获取该 func 的id.
	var addData = null;
	if(listener[msgName]){
		msgObj = listener[msgName]; 
	}else{
		listener[msgName] = msgObj = {};
	}
	if(funcId in msgObj){
		throw(callBack.name + " already a member of the listener function");
		return false;
	}
	addData = data;
	if(typeof(data)==="object"){
		addData = $.extend(true,{},data);//防止外部修改,损失了data的原貌。所以深拷贝一下
	}
	if(!funcId){//如果之前,该函数没注册过。
		funcId = callBack[funcIdKey] = getOnlyId(); //为这个 func 取一个唯一id。
	}
	msgObj[funcId] = {
		func: callBack,
		data: addData
	}
	return true;
}
function remove (msgName,callBack) {
	if(!checkMsgName(msgName)){
		return false;
	}
	if(!callBack){
		delete listener[msgName];
		return true;
	}
	if(!checkFuncName(callBack) ){
		return false;
	}
	var msgObj = listener[msgName];
	var funcId = callBack[funcIdKey];
	if(!msgObj){
		throw("you have not add listener at "+msgName);
		return false;
	}
	if(!funcId || !(funcId in msgObj)){
		throw("function "+callBack.name+"have not listen "+msgName);
		return false;
	}
	delete msgObj[funcId];
}
function removeAll () {
	for(var i in listener){
		delete listener[i];
	}
}
function checkMsgName (msg) {
	if(!msg || typeof(msg) !== "string"){
		throw("have no event name or event name is not a string.");
		return false;
	}
	return true;
}
function checkFuncName (func) {
	if(!func || typeof(func) !== "function"){
		throw("have no callBack or callBack is not a function.")
		return false;
	}
	return true;
}
function getOnlyId () {
	return (new Date()).getTime()+String(Math.random());
}
//因为 settimeout 最低也会有时间间隔,所以为了更快执行,用postmessage
// 这里采用 key-value 来存储方法. 也可以直接一个key,然后 方法全存入一个 数组中。
// 但是如果这样做 就不是一个 setImmediate 对应一个事件循环了。
/****************************************** 
例如 :
setImmediate(fn1);setImmediate(fn2);
此时 数组中 已经有 [fn1,fn2] 了。
然后会 fn1();fn2(); 这样 fn1,fn2在一次 事件处理中。
fn1 果然有bug. fn2 就不会继续运行了。

理想结果是 setImmediate(fn1);setImmediate(fn2);
然后 第一个事件循环运行 fn1, 第二个事件循环运行 fn2. 
这样,fn1 出问题了,报错。fn2 依然可以运行。

并且这样做也是为了防止,外面 调用setImmediate方法时,把内部的给调用了。
囧: 本来打算重写 dispatch , 让里面响应的函数全为异步执行.
现在觉得貌似也没必要, 使用者完全可以在外面 setImmediate(dispatch);
虽然这样是在一次事件循环中 处理所有 listener. 
但是如果在 dispatch 中再去分别调用 setImmediate, 为了能把数据带上,必然又产生一次闭包.
这样的花费是否值得？？？？？
******************************************/
var setImmediate = null;
if(window.postMessage){ 
	window.addEventListener("message", function(e) {
	    if (e.data.indexOf &&  e.data.indexOf(funcIdKey) === 0) {
	        setImmediateQueue[e.data] && setImmediateQueue[e.data]();
	        delete setImmediateQueue[e.data];
	    }
	    /*   or   
	    if (e.data === funcIdKey) {
	        var queue = setImmediateQueue;
	        setImmediateQueue = [];
	        queue.forEach(function(func) {
	          func();
	        });
	    }
	    */

    });
    setImmediate = function(func){
    	var id = funcIdKey + getOnlyId();
    	setImmediateQueue[id] = func;
    	window.postMessage(id, "*");
    	/*   or   
	    setImmediateQueue.push(func);
      	window.postMessage(funcIdKey, "*");
	    */
    }
}else{
	setImmediate = window.setTimeout;
}
var exports = {
	'add': add,
	'dispatch': dispatch,
	'remove': remove,
	'removeAll': removeAll,
	'setImmediate': setImmediate
}
module.exports = exports;

})(window);