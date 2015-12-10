/*
create by liuguodong 15/12/10
页面数据存储机制

因为所有js都是通过 module 包装了的。
所以没法有效的获得页面的数据。
所有widget只有init的时候才可能拿到他自己所需要的data。
但也只有这一次能拿到。 以后再也无法拿到。

PS:重点
虽然每个widget可以把第一次拿到的data给引用后缓存下来。
但这样是不安全的,因为对象为引用。如果一个修改后，另外一个widget也会受到影响。
如果第一次拿到数据后 通过 $.extend(true,{},data) 的形式进行深拷贝。
那么以后就无法再次拿到最新的页面数据。

所以。这里规定。
widget 不能修改数据。并且除了第一次init时的数据用来渲染页面外。后面如果想要数据就必须通过 get来获取。
widget 绝对不能调用 store 。只能调用 get 。
	为了保证数据的单项流动(好处可自行去了解flux),如果一些操作需要修改数据, 则应该widget 发出一个事件, 
	在page中响应该事件,page中进行修改数据的操作。
page 做为所有widget的调度中心。数据的相关操作,只能在page中进行。
*/

;
(function(window, undefined) {

	var baseUtil = require('static/baseUtil');


	var data = {};
	var widget = {};

	function store(_data, _widget) { //多次store 进行覆盖
		if (!_data) {
			return;
		}
		data = baseUtil.cloneData(_data);
		if (!_widget) {
			return;
		}
		widget = baseUtil.cloneData(_widget);
	}

	function get(widgetName) {
		if (!widgetName) {
			return $.extend(true, {}, data);
		}
		var str = widget[widgetName];
		var widgetData = baseUtil.getObjData(data, str);
		return baseUtil.cloneData(widgetData);
	}

	var exports = {
		'store': store,
		'get': get
	}
	module.exports = exports;

})(window);