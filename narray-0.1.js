
/*
 * nArray - JavaScript data management tools
 *
 * Copyright (c) 2016 Na Chap (https://github.com/nachao/nArray)
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Date: 2016-01-07 10:47:00 -0400 (Thu, 07 Jan 2016)
 * Ver: 0.1
 */

function nArray( value, detail ){
	
	// If the context is global, return a new object
	if ( window == this )
		return new nArray(value, detail);
}

nArray.fn = nArray.prototype = {
	version: '0.1',
}

nArray.extend = nArray.fn.extend = function ( obj, prop ) {
	if ( !prop ) { prop = obj; obj = this; }
	for ( var i in prop ) obj[i] = prop[i];
	return obj;
};

nArray.extend({
	trim: function(t){
		return typeof t == 'string' ? t.replace(/^\s+|\s+$/g, "") : t;
	},
	toKeys: function ( object ) {
		var result = [];

		if ( object && typeof object == 'object' ) {
			for ( var key in object )
				result.push(key);
		}

		return result;
	},

	// Will get characters converted to parameters
	resolve: function ( value ) {

		// 如果没有需要解析的字符串，则返回空数组
		if ( typeof value != 'string' )
			return [];

		var modes = ['<=', '>=', '<', '>', '!=', '='],
			results = [],
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
		for ( i=0; i<value.length; i++ ) {
			mode = '=';
			item = value[i];

			// 匹配对应的条件符号
			for ( j=0; j<modes.length; j++ ) {
				if ( item.indexOf(modes[j]) >= 0 ) {
					mode = modes[j];
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
					val: val,
					mode: mode
				};
			}

			if ( result.constructor == Array )
				results = results.concat(result);
			else
				results.push(result);
		}

		return results;
	},

	// To the corresponding two values, select the matching method
	// Return {boolean}
	mateMethod: function ( method, first, param ) {
		var result = false,
			second = param.val,
			firstStr = first.toString(),
			firstNum = Number(first),
			secondNum = Number(second);

		if ( first.constructor == Object || first.constructor == Array )
			firstStr = JSON.stringify(first);

		if ( param.mode == '=' )
			result = method == 'full' ?
				firstStr === second :
				firstStr.indexOf(second) >= 0;

		else if ( param.mode == '!=' )
			result = method == 'full' ?
				firstStr !== second :
				firstStr.indexOf(second) < 0;

		else if ( !!firstNum && !!secondNum ) {
			if ( param.mode == '>' )
				result = firstNum > secondNum;

			else if ( param.mode == '>=' )
				result = firstNum >= secondNum;

			else if ( param.mode == '<' )
				result = firstNum < secondNum;

			else if ( param.mode == '<=' )
				result = firstNum <= secondNum;
		}

		return result;
	},

	// According to the specified method, determine whether the data meet the conditions
	// Match Mode: = , != , > , <
	// Return {boolean}
	mateData: function ( method, data, parameter ) {
		var result = false,
			length = parameter.length,
			param,
			key,
			val,
			i,
			j;

		// 循环所以条件
		for ( i=0; i<length; i++ ) {
			param = parameter[i];
			key = parameter[i].key;
			val = parameter[i].val;

			// 如果数据有键值
			if ( key ) {

				// 判断数据是否对应键值和值
				if ( data[key] && ( result = nArray.mateMethod(method, data[key], param ) ) )
					break;
			}

			// 如果数据没有键值，但有数据值
			else if ( val ) {

				// 数组类型数据
				if ( data.constructor == Array ) {

					// 非对象查询，确保条件有值
					// 循环数组，直到找到有匹配的内容
					for ( j=0; j<data.length; j++ ) {
						if ( result = nArray.mateMethod(method, data[j], param ) )
							break;
					}
				}

				// 对象类型数据
				else if ( data.constructor == Object ) {

					// 对象查询，确保条件有值
					// 循环对象，直到找到有匹配的内容
					for ( j in data ) {
						if ( result = nArray.mateMethod(method, data[j], param ) )
							break;
					}
				}

				// 其他类型数据
				else {
					if ( result = nArray.mateMethod(method, data, param ) )
						break;
				}
			}
		}

		return result;
	},

	// Loop all data, return the match result
	mateFor: function (method, datas, parameter ) {
		var result = [];

		parameter = nArray.resolve(parameter);

		console.log(parameter);

		for ( var i=0; i<datas.length; i++ ) {
			if ( nArray.mateData(method, datas[i], parameter) )
				result.push(datas[i]);
		}

		return result;
	},

	// Whether the specified conditions are determined for the 'full match' data
	mateFull: function ( datas, parameter ) {
		return parameter ? nArray.mateFor('full', datas, parameter) : datas;
	},

	// Whether the specified condition is a 'fuzzy match' of the data
	mateFuzzy: function ( datas, parameter ) {
		return parameter ? nArray.mateFor('fuzzy', datas, parameter) : datas;
	}
});

// 对数据进行完整匹配查询，支持条件判断：<,>,>=,<=,=,!=
Array.prototype.$get = function(value) {
	return nArray.mateFull(this, value);
}

// 对数据进行模糊查询，支持条件判断：<,>,>=,<=,=,!=
Array.prototype.$search = function ( value ) {
	return nArray.mateFuzzy(this, value);
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
				if ( nArray.toKeys(this[i]).indexOf(factor[j]) >= 0 )
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
	if ( typeof value != 'undefined' ) {

		// 循环全部数据
		for ( var i=0; i<this.length; i++ ) {

			// 确保数据类型相同
			if ( this[i].constructor == value.constructor ) {
				if ( typeof value == 'object' )
					for ( var j in value )
						this[i][j] = value[j];
				else
					this[i] = value;
			}
		}
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