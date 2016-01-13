//! nArray.js
//! version : 0.3
//! author : Na Chao
//! license : FFF
//! github.com/nachao/nArray
(function ( target, factory ) {
	"use strict";

	// 将数组原型作为参数传入，进行初始化
	factory(target);

}(Array.prototype, function ( array, undefined ) {
	"use strict";

	// 初始化申明
	function nArray () {}

	nArray.fn = nArray.prototype = {};

	var 

		// 全部条件符号
		caseSign = ['<=', '>=', '<', '>', '!=', '='];


	/************************************
		工具类
	************************************/

	// 遍历数组或对象元素，回调返回 true 则终止循环
	// @return {boolean}
	function each( datas, fn ) {
		var source = datas ? datas.constructor : null,
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
	nArray.extend = nArray.fn.extend = function ( target, source ) {
		if ( !source ) { 
			source = target; 
			target = this; 
		}
		each(source, function(i, item){
			target[i] = item;
		});
		return target;
	};

	nArray.extend({

		// 更新数组数据
		update: function ( datas, value ) {
			if ( typeof value != 'undefined' && datas.constructor == Array ) {
				each(datas, function(i, data){
					if ( 'object' == typeof value )
						data = nArray.extend(data, value);

					else if ( 'function' == typeof value && value.call(data, datas.$path[i]) )
						data = nArray.extend(data, value.call(data, datas.$path[i]));
				});
			}
			return datas;
		},

		// 对数据进行去重复处理（建议只用于非对象数据）
		unique: function ( datas ) {
			var result = [];

			each(datas, function(i, data){
				if ( result.indexOf(JSON.stringify(data)) < 0 )
					result.push(data);
			});

			return result;
		},

		// 拆分条件字符串
		parseCondition: function ( value ) {
			var result = [];

			// 如果没有需要解析的字符串，则返回空数组
			value = value ? value.toString().split(',') : [];

			// 遍历全部条件
			each(value, function(i, val){
				var sign = nArray.getInquiry(val),
					item = val.split(sign),
					key = item[0],
					value = item[1];

				if ( !sign && !value ) {
					value = key || '';
					key = '';
				}

				result = result.concat(nArray.getCondition(key, value.split('|'), sign));
			});

			return result;
		},

		// 判断字符串中是否有条件符号，如果有则返回
		// @return {string}
		getInquiry: function ( value ) {
			var result;

			each(caseSign, function(i, sign){
				if ( value.indexOf(sign) >= 0 ) {
					result = sign;
					return true;
				}
			})

			return result;
		},

		// 根据给出的一个主键、值和条件符号返回一个或多个对象
		getCondition: function ( key, value, mode ) {
			var result = [];

			if ( value.constructor != Array )
				value = [value];

			each(value, function(i, val){
				result.push({
					key: key == '*' ? '' : key.trim(),
					val: val == '*' ? '' : val.trim(),
					mode: mode || '='
				});
			});

			return result;
		},

		// 根据指定的：条件，数据，方式，是否完整匹配，进行深度匹配
		// 方式包括：
		// 对数据进行完整匹配查询，method='get'；
		// 对数据进行模糊查询：method='search';
		// 支持条件：
		// <,>,>=,<=,=,!=
		mateEnter: function ( datas, value, method, whole ) {
			var result = [];

			// 判断是否为严格查询
			if ( whole )
				method = 'whole ' + method;

			// 确保数据为数组类型
			if ( datas.constructor != Array )
				datas = [datas];

			// 初始化查询路径
			result.constructor.prototype.$path = [];

			// 判断是否有数据
			if ( datas )
				nArray.mateDepth(method, value, datas, result);

			return result;
		},

		// 深度查询数据，如果数据的值是对象类型，则递归调用
		// Return {array}
		mateDepth: function ( method, condition, datas, result, paths, keys, key ) {
			var newPaths = [],
				newKeys = [];

			// 初始化路径数据
			nArray.extend(newKeys, keys || []);
			nArray.extend(newPaths, paths || []);

			// 匹配对象类型数据
			if ( datas && [Function, Object, Array].indexOf(datas.constructor) > -1 ) {
				typeof key != 'undefined' && newKeys.push(key);
				newPaths.push(datas);

				// 判断当前值是否满足给定的条件，满足则保存数据返回值，以及对应的路径数据
				if ( nArray.mateCondition(method, datas, condition) ) {
					result.push(newPaths[newPaths.length-1]);
					result.constructor.prototype.$path.push({
						key: newKeys,
						value: newPaths
					});
				}

				// 递归所有对象类型（数组和对象）数据
				each(datas, function(key, data){
					nArray.mateDepth(method, condition, data, result, newPaths, newKeys, key);
				});
			}
		},

		// 匹配条件
		// Return {boolean}
		mateCondition: function ( method, datas, condition ) {
			var result = false,
				rights = 0;

			// 获取条件数组数据
			condition = nArray.parseCondition(condition);

			// 循环所以条件
			each(condition, function(i, param){

				// 条件有主键，被查询数据是对象类型数据
				if ( param.key && typeof datas == 'object' ) {
					each(datas, function(key, data){
						return result = nArray.mateKeys(key, param, method) && nArray.mateValues(data, param, method);
					});
				}

				// 如果数据没有键值
				else if ( !param.key && typeof datas == 'object' ) {
					each(datas, function(i, data){
						return result = nArray.mateValues(data, param, method);
					});
				}

				// 其他情况，直接匹配值
				else {
					result = nArray.mateValues(datas, param, method);
				}

				// 判断是否为多条件严格匹配
				if ( result && method.indexOf('whole') >= 0 )
					result = ++rights == condition.length;

				return result;
			});

			return result;
		},

		// 根据条件，判断值是否匹配
		// Return {boolean}
		mateKeys: function ( key, param, method ) {
			param.key = param.key.toLocaleLowerCase();
			key = String(key).toString().toLocaleLowerCase();

			return method.indexOf('get') >= 0 ?
				key === param.key :
				key.indexOf(param.key) >= 0;
		},

		// 根据条件，判断值是否匹配
		// Return {boolean}
		mateValues: function ( value, param, method ) {
			var result = false,
				strValue = value ? value.toString().toLocaleLowerCase() : '',
				strVal = param.val.toString().toLocaleLowerCase(),
				numVal = !!Number(param.val) ? Number(param.val) : param.val;

			// 对象或函数数据不能进行匹配
			if ( ['object', 'function'].indexOf(typeof value) >= 0 )
				return result;

			switch ( param.mode ) {
				case '=' :
					result = method.indexOf('get') >= 0 ?
						strValue === strVal :
						strValue.indexOf(strVal) >= 0;
					break;

				case '!=' :
					result = method.indexOf('search') >= 0 ?
						strValue.indexOf(strVal) < 0 :
						strValue !== strVal;
					break;

				case '>' :
					result = value > numVal; 
					break;

				case '>=' :
					result = value >= numVal;
					break;

				case '<' :
					result = value < numVal;
					break;

				case '<=' :
					result = value <= numVal;
					break;
			}

			return result;
		}

	});


	/************************************
		扩展目标
	************************************/
	nArray.extend(array, {

		// 匹配查询
		$get: function ( value, whole ) {
			return nArray.mateEnter(this, value, 'get', whole);
		},

		// 模糊查询
		$search: function ( value, whole ) {
			return nArray.mateEnter(this, value, 'search', whole);
		},

		// 对数据进行批量修改或扩展
		$update: function ( value ) {
			return nArray.update(this, value);
		},

		// 查询结果的路径
		$path: []
	});

	window.nArray = nArray;
}));