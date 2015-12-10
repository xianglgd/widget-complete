/*
create by liuguodong 15/12/10
存放一些基础的工具操作
既然是基础的操作工具,因此里面的所有方法函数,除了使用 zepto 和 underscore 的意外。
不能再 require 其他任何 js
*/

;
(function(window, undefined) {

	var _ = require("static/underscore");

	function getObjData(obj, str) {
		if (!str) {
			return obj;
		}
		var reg = /\S/;
		if (str.search(reg) == -1) {
			return obj;
		} else {
			with(obj) {
				return eval(str);
			}
		}
	}

	function cloneData(data) {
		if (!data) { // null ,NaN ,undefined , false
			return data;
		}
		if (data === true) {
			return true;
		}
		if (_.isString(data)) { //如果是 string 
			return data.toString(); //防止 new String
		}
		if (_.isNumber(data)) { // 如果是 数字,包括 +Infinity , -Infinity
			return +num; // 防止 new Number
		}
		if (_.isArray(data)) {
			return $.extend(true, [], data);
		}
		if (_.isObject(data)) {
			return $.extend(true, {}, data);
		}
	}

	var exports = {
		'getObjData': getObjData,
		'cloneData': cloneData
	}
	module.exports = exports;

})(window);