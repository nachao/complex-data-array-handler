//! nArray.js
//! version : 0.3
//! author : Na Chao
//! license : FFF
//! github.com/nachao/nArray

(function ( target, factory ) {
	"use strict";

	// 将数组原型作为参数传入，进行初始化
	return factory(target.constructor);

}(Array, function ( array, n ) {
	"use strict";

	// 初始化申明
	window.nArray = nArray = n;

	nArray.fn = nArray.prototype = {}

	var 

		// 全部条件符号
		caseSign = ['<=', '>=', '<', '>', '!=', '='];


	/************************************
		工具类
	************************************/

	// 遍历数组或对象元素，回调返回 true 则终止循环
	// @return {boolean}
	function each( datas, fn ) {
		var source = datas.constructor,
			result,
			j;

		if ( source == Object ) {
			for ( j in datas )
				if ( result = fn(j, datas[j]) )
					break;
		}

		if ( source == Array ) {
			for ( j=0; j<datas.length; j++ )
				if ( result = fn(j, datas[j]) )
					break;
		}

		return !!result;
	}


	/************************************
		兼容性
	************************************/

	// Production steps of ECMA-262, Edition 5, 15.4.4.14
	// Reference: http://es5.github.io/#x15.4.4.14
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(searchElement, fromIndex) {

			var k;

			// 1. Let O be the result of calling ToObject passing
			//    the this value as the argument.
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get
			//    internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If len is 0, return -1.
			if (len === 0) {
				return - 1;
			}

			// 5. If argument fromIndex was passed let n be
			//    ToInteger(fromIndex); else let n be 0.
			var n = +fromIndex || 0;

			if (Math.abs(n) === Infinity) {
				n = 0;
			}

			// 6. If n >= len, return -1.
			if (n >= len) {
				return - 1;
			}

			// 7. If n >= 0, then Let k be n.
			// 8. Else, n<0, Let k be len - abs(n).
			//    If k is less than 0, then let k be 0.
			k = Math.max(n >= 0 ? n: len - Math.abs(n), 0);

			// 9. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the
				//    HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				//    i.  Let elementK be the result of calling the Get
				//        internal method of O with the argument ToString(k).
				//   ii.  Let same be the result of applying the
				//        Strict Equality Comparison Algorithm to
				//        searchElement and elementK.
				//  iii.  If same is true, return k.
				if (k in O && O[k] === searchElement) {
					return k;
				}
				k++;
			}
			return - 1;
		};
	}

	// 兼容那些没有原生支持Object.key方法的JavaScript环境。
	if (!Object.keys) {
		Object.keys = function(o) {
			if (o !== Object(o)) 
				throw new TypeError('Object.keys called on a non-object');
			var k = [], p;
			for (p in o) 
				if (Object.prototype.hasOwnProperty.call(o, p))
					k.push(p);
			return k;
		}
	}

	// 如果浏览器本身不支持String对象的trim方法,那么运行下面的代码可以兼容这些环境.
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}


	/************************************
		定义功能方法
	************************************/

	// 扩展方法
	nArray.extend = nArray.fn.extend = function ( obj, prop ) {
		if ( !prop ) { prop = obj; obj = this; }
		for ( var i in prop ) obj[i] = prop[i];
		return obj;
	};

	nArray.extend({

		// 更新数据
		update: function ( data, value ) {
			if ( typeof value != 'undefined' ) {

				// 确保数据类型相同
				if ( data.constructor == value.constructor ) {
					if ( typeof value == 'object' ) {
						nArray.each(value, function(i, val){
							data[i] = val;
						});
					}
					else {
						data = value;
					}
				}
			}
			return data;
		},

		// 拆分条件字符串
		mateResolve: function ( value ) {

			// 如果没有需要解析的字符串，则返回空数组
			if ( typeof value != 'string' )
				return [];

			var results = [],
				result,
				mode,
				item,
				many,
				key,
				val,
				i,
				j;

			value = value.toString().split(',');

			// 遍历全部条件
			each(value, function(){

			});

				mode = '=';
				item = value[i];

				// 匹配对应的条件符号
				for ( j=0; j<caseSign.length; j++ ) {
					if ( item.indexOf(caseSign[j]) >= 0 ) {
						mode = caseSign[j];
						break;
					}
				}

				item = item.split(mode);

				// 键值
				if ( item.length > 1 ) {
					key = nArray.trim(item[0]);
					val = nArray.trim(item[1]);
				}
				else {
					key = null;
					val = nArray.trim(item[0]);
				}

				// 一个条件对应多个值
				if ( val.indexOf('|') >= 0 ) {
					many = val.split('|');
					result = [];
					for ( k=0; k<many.length; k++ ) {
						result.push({
							key: key,
							val: nArray.trim(many[k]),
							mode: mode
						});
					}
				}
				else {

					// 条件格式，及默认数据
					result = {
						key: key,
						val: val == '*' ? '' : val,
						mode: mode
					};
				}

				if ( result.constructor == Array )
					results = results.concat(result);
				else
					results.push(result);
			}

			return results;
		}

		// 拆分条件字符串
		// 根据给出的一个主键、值和条件符号返回一个或多个对象
		mateCondition: function ( key, value ) {
			var result = [];

			if ( value.constructor != Array )
				value = [value];

			each(value, function(i, val){
				result.push({
					key: key,
					val: val == '*' ? '' : val,
					mode: mode
				})
			});

			return result;
		}
	}

}));



 * nArray - JavaScript data management tools
 *
 * Copyright (c) 2016 Na Chao (https://github.com/nachao/nArray)
 * Dual licensed under the MIT (Lie to you ) 
 * and not have GPL licenses.
 *
 * Author: 'Na Chao'
 * Date: 2016/1/11 10:40:26
 * Ver: 0.2.8


function nArray( value, detail ){
	
	// If the context is global, return a new object
	if ( window == this )
		return new nArray(value, detail);
}

nArray.fn = nArray.prototype = {}

// nArray.extend = nArray.fn.extend = function ( obj, prop ) {
// 	if ( !prop ) { prop = obj; obj = this; }
// 	for ( var i in prop ) obj[i] = prop[i];
// 	return obj;
// };

nArray.extend({
	// trim: function(t){
	// 	return typeof t == 'string' ? t.replace(/^\s+|\s+$/g, "") : t;
	// },
	// each: function(datas, fn){
	// 	var result = false,
	// 		source = datas.constructor,
	// 		j;
	// 	if ( source == Object ) {
	// 		for ( j in datas )
	// 			if ( result = fn(j, datas[j]) )
	// 				break;
	// 	}
	// 	if ( source == Array ) {
	// 		for ( j=0; j<datas.length; j++ )
	// 			if ( result = fn(j, datas[j]) )
	// 				break;
	// 	}
	// 	return result;
	// },
	// indexOf: function(array, elt){
	// 	var len = array.length >>> 0;
	// 	var from = Number(arguments[1]) || 0;

	// 	from = (from < 0)
	// 		? Math.ceil(from)
	// 		: Math.floor(from);

	// 	if (from < 0)
	// 		from += len;

	// 	for (; from < len; from++) {
	// 		if (from in array && array[from] === elt)
	// 			return from;
	// 	}

	// 	return -1;
	// },
	// toKeys: function ( object ) {
	// 	var result = [];

	// 	if ( object && typeof object == 'object' ) {
	// 		for ( var key in object )
	// 			result.push(key);
	// 	}

	// 	return result;
	// },
	// toArray: function ( object, key ) {
	// 	var result = [];

	// 	if ( !object )
	// 		return;

	// 	for ( var i in object ) {
	// 		if ( typeof key == 'string' )
	// 			object[i][key] = i;
	// 		result.push(object[i]);
	// 	}

	// 	return result;
	// },
	// toObject: function ( array, key ) {
	// 	var result = {};

	// 	if ( !array )
	// 		return;

	// 	for ( var i=0; i<array.length; i++ ) {
	// 		if ( typeof key == 'string' && array[i][key] ) {
	// 			result[array[i][key]] = array[i];
	// 		}
	// 		else
	// 			result[i] = array[i];
	// 	}

	// 	return result;
	// },
	// update: function ( data, value ) {
	// 	if ( typeof value != 'undefined' ) {

	// 		// 确保数据类型相同
	// 		if ( data.constructor == value.constructor ) {
	// 			if ( typeof value == 'object' ) {
	// 				nArray.each(value, function(i, val){
	// 					data[i] = val;
	// 				});
	// 			}
	// 			else {
	// 				data = value;
	// 			}
	// 		}
	// 	}
	// 	return data;
	// },

	// Will get characters converted to parameters
	// mateResolve: function ( value ) {

	// 	// 如果没有需要解析的字符串，则返回空数组
	// 	if ( typeof value != 'string' )
	// 		return [];

	// 	var modes = ['<=', '>=', '<', '>', '!=', '='],
	// 		results = [],
	// 		result,
	// 		mode,
	// 		item,
	// 		many,
	// 		key,
	// 		val,
	// 		i,
	// 		j;

	// 	value = value.toString().split(',');

	// 	// 遍历全部条件
	// 	for ( i=0; i<value.length; i++ ) {
	// 		mode = '=';
	// 		item = value[i];

	// 		// 匹配对应的条件符号
	// 		for ( j=0; j<modes.length; j++ ) {
	// 			if ( item.indexOf(modes[j]) >= 0 ) {
	// 				mode = modes[j];
	// 				break;
	// 			}
	// 		}

	// 		item = item.split(mode);

	// 		// 键值
	// 		if ( item.length > 1 ) {
	// 			key = nArray.trim(item[0]);
	// 			val = nArray.trim(item[1]);
	// 		}
	// 		else {
	// 			key = null;
	// 			val = nArray.trim(item[0]);
	// 		}

	// 		// 一个条件对应多个值
	// 		if ( val.indexOf('|') >= 0 ) {
	// 			many = val.split('|');
	// 			result = [];
	// 			for ( k=0; k<many.length; k++ ) {
	// 				result.push({
	// 					key: key,
	// 					val: nArray.trim(many[k]),
	// 					mode: mode
	// 				});
	// 			}
	// 		}
	// 		else {

	// 			// 条件格式，及默认数据
	// 			result = {
	// 				key: key,
	// 				val: val == '*' ? '' : val,
	// 				mode: mode
	// 			};
	// 		}

	// 		if ( result.constructor == Array )
	// 			results = results.concat(result);
	// 		else
	// 			results.push(result);
	// 	}

	// 	return results;
	// },

	// Loop all data, return the match result
	mateFor: function (method, datas, parameter, whole ) {
		var result = [],
			params = nArray.mateResolve(parameter);

		// 初始化查询路径
		result.constructor.prototype.$path = []

		// 深度查询方式
		nArray.mateDepth(method, params, datas, result);

		return result;
	},

	// Depth matching, return to the match to the data, as well as path.
	// Return {array}
	mateDepth: function ( method, params, datas, result, paths, keys, key ) {
		var path = [],
			newKeys = [],
			i;

		if ( !paths )
			paths = [];

		if ( !keys )
			keys = [];

		for ( var i=0; i<paths.length; i++ )
			path.push(paths[i]);

		for ( var i=0; i<keys.length; i++ )
			newKeys.push(keys[i]);

		if ( datas.constructor == Object ) {
			path.push(datas);
			newKeys.push(key);
			if ( nArray.mateData(method, params, datas) ) {
				result.push(path[path.length-1]);
				result.constructor.prototype.$path.push({
					key: newKeys,
					value: path
				});
			}
			for ( i in datas )
				nArray.mateDepth(method, params, datas[i], result, path, newKeys, i);
		}
		else if ( datas.constructor == Array ) {
			path.push(datas);
			newKeys.push(key);
			if ( nArray.mateData(method, params, datas) ) {
				result.push(path[path.length-1]);
				result.constructor.prototype.$path.push({
					key: newKeys,
					value: path
				});
			}
			for ( i=0; i<datas.length; i++ )
				nArray.mateDepth(method, params, datas[i], result, path, newKeys, i);
		}
		else if ( nArray.mateData(method, params, datas) ) {
			result.push(path[path.length-1]);
				result.constructor.prototype.$path.push({
					key: newKeys,
					value: path
				});
		}
	},

	// According to the specified method, determine whether the data meet the conditions
	// Return {boolean}
	mateData: function ( method, params, datas ) {
		var result = false,
			rights = 0,
			param,
			i,
			j;

		// 循环所以条件
		for ( i=0; i<params.length; i++ ) {
			param = params[i];

			// 如果数据有键值
			if ( param.key ) {

				// 条件有主键，被查询数据一定需要时数组或对象
				if ( typeof datas == 'object' ) {

					// 循环对象或数组全部数据，直到有匹配中的值为止
					nArray.each(datas, function(key, data){
						if ( nArray.mateKeys(key, param, method) && nArray.mateValues(data, param, method) )
							return result = true;
					});
				}
			}

			// 如果数据没有键值，但有数据值
			else {
				if ( typeof datas == 'object' ) {
					nArray.each(datas, function(i, data){
						return result = nArray.mateValues(data, param, method);
					});
				}
				else {
					result = nArray.mateValues(datas, param, method);
				}
			}

			if ( result ) {

				// 判断是否为多条件严格匹配
				if ( method.indexOf('whole') >= 0 )
					result = ( ++rights == params.length );
				else
					break;
			}
		}

		return result;
	},

	// To the corresponding two values, select the matching method
	// Param {object|array} data
	// Return {boolean}
	mateKeys: function ( key, param, method ) {
		param.key = param.key.toLocaleLowerCase();
		key = String(key).toString().toLocaleLowerCase();

		return method.indexOf('full') >= 0 ?
			key === param.key :
			key.indexOf(param.key) >= 0;
	},

	// To the corresponding two values, select the matching method
	// Return {boolean}
	mateValues: function ( value, param, method ) {
		var result = false,
			strValue = value.toString().toLocaleLowerCase(),
			strVal = param.val.toString().toLocaleLowerCase(),
			numVal = !!Number(param.val) ? Number(param.val) : param.val;

		if ( param.mode == '=' )
			result = method.indexOf('full') >= 0 ?
				strValue === strVal :
				strValue.indexOf(strVal) >= 0;

		else if ( param.mode == '!=' )
			result = method.indexOf('search') >= 0 ?
				strValue.indexOf(strVal) < 0 :
				strValue !== strVal;

		else {
			if ( param.mode == '>' )
				result = value > numVal;

			else if ( param.mode == '>=' )
				result = value >= numVal;

			else if ( param.mode == '<' )
				result = value < numVal;

			else if ( param.mode == '<=' )
				result = value <= numVal;
		}

		return result;
	},

	// Whether the specified conditions are determined for the 'full match' data
	mateFull: function ( datas, parameter, whole ) {
		var method = 'full';

		// 判断是否为严格查询
		if ( whole )
			method = 'whole ' + method;

		return parameter ? nArray.mateFor(method, datas, parameter) : datas;
	},

	// Whether the specified condition is a 'fuzzy match' of the data
	mateSearch: function ( datas, parameter, whole ) {
		var method = 'search';

		// 判断是否为严格搜索
		if ( whole )
			method = 'whole ' + method;

		return parameter ? nArray.mateFor(method, datas, parameter) : datas;
	}
});

// 对数据进行完整匹配查询，支持条件判断：<,>,>=,<=,=,!=
Array.prototype.$get = function ( value, whole ) {
	return nArray.mateFull(this, value, whole);
}

// 对数据进行模糊查询，支持条件判断：<,>,>=,<=,=,!=
Array.prototype.$search = function ( value, whole ) {
	return nArray.mateSearch(this, value, whole);
},

// 对数据进行过滤，提取指定需要的值
Array.prototype.$fetch = function ( value ) {
	var result = [],
		factor = [],
		item;

	value = value ? value.split(',') : [];

	for ( var i=0; i<value.length; i++ )
		factor.push(nArray.trim(value[i]));

	if ( factor.length ) {

		// 循环全部数据
		for ( var i=0; i<this.length; i++ ) {
			item = {};
			for ( var j=0; j<factor.length; j++ ) {
				if ( nArray.indexOf(nArray.toKeys(this[i]), factor[j]) >= 0 )
					item[factor[j]] = this[i][factor[j]];
			}
			if ( nArray.toKeys(item).length )
				result.push(item);
		}
	}
	else {
		result = this;
	}

	return result;
},

// 对数据进行批量修改或扩展
Array.prototype.$update = function ( value ) {
	var result;

	// 循环全部数据
	for ( var i=0; i<this.length; i++ ) {

		if ( typeof value == 'function' )
			result = value.call(this[i], this.$path[i]);
		else
			result = value;

		nArray.update(this[i], result);
	}

	return this;
}

// 对数据进行去重复处理（只作用于元素为非object、array、null、underfind）
Array.prototype.$unique = function () {
	var result = [];

	for ( var i=0; i<this.length; i++ ) {
		if ( result.indexOf(this[i]) < 0 )
			result.push(this[i]);
	}

	return result;
}

// 数据路径
Array.prototype.$path = [];
 
