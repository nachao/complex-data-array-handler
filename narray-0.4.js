//! nArray.js
//! version : 0.4/60412/12
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
	function NArray () {}

	// 初始化原型
	NArray.fn = NArray.prototype = {};

	// 备注版本
	NArray.version = 0.4/60412/12

	var 

		/**
		 *  全部条件符号
		 *
		 *  说明：处于对编程习惯考虑的原因“等于匹配符号”添加了一个双等于号（==），
		 *  它和单等于号（=）完全一样。
		 *  因为此工具已经有被项目使用，所有不删除 = 符号，两个都可以正常使用。  
		 *
		 *  提示：strict（精确匹配）参数只有条件符号为：'==' 是有效； 
		 */
		caseSign = ['<=', '>=', '<', '>', '!=', '==', '=' ];


	/************************************
		工具类
	************************************/

	// 遍历数组或对象元素，回调返回 true 则终止循环
	// @return {boolean}
	function each( datas, fn ) {
		var log = [],
			result,
			j;

		for ( j in datas ) {
			if ( datas.hasOwnProperty(j) && log.indexOf(datas[j]) < 0 && (result = fn(j, datas[j]) ) )
				break;

			log.push(datas[j]);
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
	NArray.extend = NArray.fn.extend = function ( target, source ) {
		if ( !source ) { 
			source = target; 
			target = this; 
		}
		each(source, function(i, item){
			target[i] = item;
		});
		return target;
	};

	NArray.extend({

		// 更新数组数据
		update: function ( datas, value ) {
			if ( typeof value != 'undefined' && datas.constructor == Array ) {
				each(datas, function(i, data){
					if ( 'object' == typeof value )
						NArray.extend(data, value);

					else if ( 'function' == typeof value && value.call(data, datas.$path[i]) )
						NArray.extend(data, value.call(data, datas.$path[i]));
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

		/***********************************************************
		 * 判断字符串中是否有条件符号，如果有则返回，
		 * 如果不给判断值，则返回默认条件符号 ‘==’。
		 *
		 * @param {string} value = 判断此值是否在匹配符号中，选填
		 * @return {string}
		 **/
		getInquiry: function ( value ) {
			var result = '==';

			if ( value ) {
				each(caseSign, function(i, sign){
					if ( value.indexOf(sign) >= 0 ) {
						result = sign;
						return true;
					}
				});
			}

			return result;
		},
 
		/**
		 * 如果是快速（字符串）匹配，则将数据值和条件值都转换为字符串，其转换为小写；
		 * 以及处理特殊数据为空字符串
		 *
		 * @param {*} value = 判断此值是否在匹配符号中，选填
		 * @return {string}
		 **/
		setSpecialValue: function ( value ) {
			var result = '';

			if ( value !== null && value !== undefined )
				result = value.toString().toLocaleLowerCase();

			return result;
		},

		/**
		 * 遍历条件
		 * 根据一个主键、值和条件符号返回一个或多个对象
		 *
		 * #对于没有的参数会给出默认值。
		 *
		 * @param {object} cond = 包含以下参数
		 * @param {string} key
		 * @param {string|number|boolean|null|undefined} value
		 * @param {string} mode
		 * @param {boolean} enable
		 * @param {boolean} strict = 是否严格匹配值，默认false。说明：true 等于 ===；false 为 ==；
		 *
		 * @return {array}
		 **/
		eachCondition: function ( cond ) {
			var result = [],
				array = [];

			// 处理字符串类型判断是否有多个值
			if ( !!cond.value && typeof cond.value == 'string' )
				array = cond.value.split('|');	// 转换为数组格式

			// 处理空值或非数组
			else if ( !cond.value || cond.value.constructor != Array ) {
				array = [cond.value];			// 转换为数组格式
			}

			// 遍历全部此条件，处理一个条件对应多个值的情况
			each(array, function(i, val){

				// 设置格式和默认值
				var rule = {
						key: cond.key || '',
						val: val,
						mode: cond.mode || '==',
						enable: typeof cond.enable == 'boolean' ? cond.enable : true,	// 是否启用，默认：true
						strict: cond.strict || false									// 是否严格匹配，默认：false
					};

				// 处理特殊字符
				if ( rule.key == '*' )
					rule.key = '';

				if ( rule.val == '*' )
					rule.val = '';

				// 格式化字符串（去空格）
				if ( typeof rule.key == 'string' )
					rule.key = rule.key.trim();

				if ( typeof rule.val == 'string' )
					rule.val = rule.val.trim();

				// 快速（字符串）查询时，如果将条件值为：空值（null、undefined）、布尔值（false）、数值（0）转换为空字符
				if ( !rule.strict )
					rule.val = rule.val || '';

				// 初始化条件格式和值
				result.push(rule);
			});

			return result;
		},

		/**
		 * 拆分条件字符串
		 *
		 * @param {string} cond
		 * @return {array}
		 **/
		parseByString: function ( cond ) {
			var result = [],
				array = cond ? cond.toString().split(',') : [''];	// 如果没有需要解析的字符串，则返回带一个空字符串的数组

			// 遍历全部条件
			each(array, function(i, value){
				var mode = NArray.getInquiry(value),
					item = value.split(mode),
					cond = {
						key: item[0], 
						value: item[1], 
						mode: mode
					};

				// 在没有条件符号的情况下，则匹配全部键值
				if ( typeof cond.value == 'undefined' ) {
					cond.value = cond.key || '';
					cond.key = '';
				}

				// 遍历和初始条件参数
				result = result.concat(NArray.eachCondition(cond));
			});

			return result;
		},

		/**
		 * 解析详细（对象）条件
		 *
		 * @param {array|object} value
		 * @return {array}
		 **/
		parseByObject: function ( value ) {
			var result = [],
				array = value;

			// 如果条件为单个对象，则将其转换为数组
			if ( array.constructor !== Array )
				array = [value];

			// 遍历全部条件
			each(array, function(i, val){
				result = result.concat(NArray.eachCondition(val));
			});

			return result;
		},

		/**
		 *  判断条件类型和根据相关配置对条件进行解析
		 **/
		parseCondition: function ( value ) {
			var result = [];

			// 字符串查询条件解析方式，包括类型：字符串、数字、布尔、空值（null、undefined）
			if ( ['string', 'boolean', 'number'].indexOf(typeof value) >= 0 || value === null || value === undefined ) {
				value = NArray.setSpecialValue(value);	// 将非字符串类型，转换为字符串
				result = NArray.parseByString(value);
			}

			// 详细（对象、对象数组）查询条件解析方式
			else if ( value.constructor == Array || value.constructor == Object ) {
				result = NArray.parseByObject(value);
			}

			return result;
		},

		/***************************************************************
		 *  根据指定的：条件，数据，方式，是否完整匹配，进行深度匹配
		 *  方式包括：
		 *  对数据进行完整匹配查询，method='get'；
		 *  对数据进行模糊查询：method='search';
		 *  支持条件：
		 *  <,>,>=,<=,=,!=
		 **/
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

			// 判断和解析条件
			value = NArray.parseCondition(value);

			// 判断是否有数据
			if ( datas )
				NArray.mateDepth(method, value, datas, result);

			return result;
		},

		// 深度查询数据，如果数据的值是对象类型，则递归调用
		// Return {array}
		mateDepth: function ( method, condition, datas, result, paths, keys, key ) {
			var newPaths = [],
				newKeys = [];

			// 初始化路径数据
			NArray.extend(newKeys, keys || []);
			NArray.extend(newPaths, paths || []);

			// 匹配对象类型数据
			if ( datas && [Function, Object, Array].indexOf(datas.constructor) > -1 ) {
				typeof key != 'undefined' && newKeys.push(key);
				newPaths.push(datas);

				// 判断当前值是否满足给定的条件，满足则保存数据返回值，以及对应的路径数据
				if ( NArray.mateCondition(method, datas, condition) ) {
					result.push(newPaths[newPaths.length-1]);
					result.constructor.prototype.$path.push({
						key: newKeys,
						value: newPaths
					});
				}

				// 递归所有对象类型（数组和对象）数据
				each(datas, function( i, data ){
					NArray.mateDepth(method, condition, data, result, newPaths, newKeys, key);
				});
			}
		},

		// 匹配条件
		// Return {boolean}
		mateCondition: function ( method, datas, condition ) {
			var result = false,
				rights = 0;

			// 循环所以条件
			each(condition, function(i, param){

				// 条件有主键，被查询数据是对象类型数据
				if ( param.key && typeof datas == 'object' ) {
					each(datas, function(key, data){
						return result = NArray.mateKeys(key, param, method) && NArray.mateValues(data, param, method);
					});
				}

				// 如果数据没有键值
				else if ( !param.key && typeof datas == 'object' ) {
					each(datas, function(i, data){
						return result = NArray.mateValues(data, param, method);
					});
				}

				// 其他情况，直接匹配值
				else {
					result = NArray.mateValues(datas, param, method);
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
		mateValues: function ( value, cond, method ) {
			var result = false;

			// 如果是普通（字符串快速）匹配，则对数据进行处理（确保是小写的字符串内容）
			if ( !cond.strict ) {
				value = NArray.setSpecialValue(value);
				cond.val = NArray.setSpecialValue(cond.val);

			// 如果是严格模式，对被查询的数据进行处理
			} else {

				// 如果是模糊查询，则强行将查询数据转换为字符串
				if ( method == 'search' )
					value = JSON.stringify(value);
			}

			// 是否生效
			if ( !cond.enable )
				return result;

			// 对象或函数数据不能进行匹配
			// 如果数据内容的值为 null，则按照空字符串来匹配
			if ( ['object', 'function'].indexOf(typeof value) >= 0 && value != null )
				return result;

			switch ( cond.mode ) {
				case '=' :
				case '==' :
					result = method.indexOf('get') >= 0 ?
						( cond.strict ? value === cond.val : value == cond.val ) :
						value.indexOf(cond.val) >= 0;
					break;

				case '!=' :
					result = method.indexOf('search') >= 0 ?
						value.indexOf(cond.val) < 0 :
						value !== cond.val;
					break;

				default :
					result = eval('"' + value + '"' + cond.mode + '"' + cond.val + '"'); 
			}

			return result;
		}

	});


	/************************************
		扩展目标
	************************************/
	NArray.extend(array, {

		// 匹配查询
		$get: function ( value, whole ) {
			return NArray.mateEnter(this, value, 'get', whole);
		},

		// 模糊查询
		$search: function ( value, whole ) {
			return NArray.mateEnter(this, value, 'search', whole);
		},

		// 对数据进行批量修改或扩展
		$update: function ( value ) {
			return NArray.update(this, value);
		},

		// 查询结果的路径
		$path: []
	});

	// window.nArray = NArray;
}));