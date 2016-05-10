//! nArray.js
//! version : 0.4/600506/1
//! author : Na Chao
//! license : FFF
//! github.com/nachao/nArray
(function ( target, factory ) {
	"use strict";

	// ������ԭ����Ϊ�������룬���г�ʼ��
	factory(target);

}(Array.prototype, function ( array, undefined ) {
	"use strict";

	// ��ʼ������
	function NArray () {}

	// ��ʼ��ԭ��
	NArray.fn = NArray.prototype = {};

	// ��ע�汾
	NArray.version = 0.4/600506/1;

	// ���ܼ�¼
	NArray.log = {
		cycles: 0
	};

	var 

		/**
		 *  ȫ����������
		 *
		 *  ˵�������ڶԱ��ϰ�߿��ǵ�ԭ�򡰵���ƥ����š������һ��˫���ںţ�==����
		 *  ���͵����ںţ�=����ȫһ����
		 *  ��Ϊ�˹����Ѿ��б���Ŀʹ�ã����в�ɾ�� = ���ţ���������������ʹ�á�  
		 *
		 *  ��ʾ��strict����ȷƥ�䣩����ֻ����������Ϊ��'==' ����Ч�� 
		 */
		caseSign = ['<=', '>=', '<', '>', '!=', '==', '=' ];


	/************************************
		������
	************************************/

	// ������������Ԫ�أ��ص����� true ����ֹѭ��
	// @return {boolean}
	function each( datas, fn, t ) {
		var log = [],
			result,
			j;

		for ( j in datas ) {
			NArray.log.cycles += 1;

			if ( datas.hasOwnProperty(j) && log.indexOf(datas[j]) < 0 && (result = fn(j, datas[j]) ) )
				break;

			if ( typeof datas[j] == 'object' )
				log.push(datas[j]);
		}

		return !!result;
	}


	/************************************
		������
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

	// ������Щû��ԭ��֧��Object.key������JavaScript������
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

	// ������������֧��String�����trim����,��ô��������Ĵ�����Լ�����Щ����.
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

	// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
	// Partial support for most common case - getters, setters, and values
	(function() {
		if (!Object.defineProperty || !(function () {try {Object.defineProperty({}, 'x', {}); return true; } catch (e) {return false; } }()) ) {
			var orig = Object.defineProperty;
			Object.defineProperty = function (o, properties, desc) {

				// In IE8 try built-in implementation for defining properties on DOM prototypes.
				if (orig) {try {return orig(o, prop, desc); } catch (e) {} }

				if (o !== Object(o)) {
					throw TypeError("Object.defineProperty called on non-object");
				}
				if (Object.prototype.__defineGetter__ && ('get' in desc)) {
					Object.prototype.__defineGetter__.call(o, prop, desc.get);
				}
				if (Object.prototype.__defineSetter__ && ('set' in desc)) {
					Object.prototype.__defineSetter__.call(o, prop, desc.set);
				}
				if ('value' in desc) {
					o[prop] = desc.value;
				}
				return o;
			};
		}
	}());


	/************************************
		���幦�ܷ���
	************************************/


	// ��չ���������������Ծ�Ϊ����ö��
	NArray.extend = NArray.fn.extend = function ( target, source ) {
		if ( !source ) { 
			source = target; 
			target = this; 
		}
		each(source, function(key, value){

			// ʹ�����������������������ݣ��������ڶ���Ϊ����ö��
			Object.defineProperty(target, key, {
				configurable: true,
				enumerable: target.propertyIsEnumerable(key),	// ���֮ǰ�ǿ�ö�ٵģ��򱣳ֿ�ö��״̬
				writable: true,
				value: value,
			});
		});
		return target;
	};

	NArray.extend({

		// ������������
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

		// �����ݽ���ȥ�ظ���������ֻ���ڷǶ������ݣ�
		unique: function ( datas ) {
			var result = [];

			each(datas, function(i, data){
				if ( result.indexOf(JSON.stringify(data)) < 0 )
					result.push(data);
			});

			return result;
		},

		/***********************************************************
		 * �ж��ַ������Ƿ����������ţ�������򷵻أ�
		 * ��������ж�ֵ���򷵻�Ĭ���������� ��==����
		 *
		 * @param {string} value = �жϴ�ֵ�Ƿ���ƥ������У�ѡ��
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
		 * ����ǿ��٣��ַ�����ƥ�䣬������ֵ������ֵ��ת��Ϊ�ַ�������ת��ΪСд��
		 * �Լ�������������Ϊ���ַ���
		 *
		 * @param {*} value = �жϴ�ֵ�Ƿ���ƥ������У�ѡ��
		 * @return {string}
		 **/
		setSpecialValue: function ( value ) {
			var result = '';

			if ( value !== null && value !== undefined )
				result = value.toString().toLocaleLowerCase();

			return result;
		},

		/**
		 * ��������
		 * ����һ��������ֵ���������ŷ���һ����������
		 *
		 * #����û�еĲ��������Ĭ��ֵ��
		 *
		 * @param {object} cond = �������²���
		 * @param {string} key
		 * @param {string|number|boolean|null|undefined} value
		 * @param {string} mode
		 * @param {boolean} enable
		 * @param {boolean} strict = �Ƿ��ϸ�ƥ��ֵ��Ĭ��false��˵����true ���� ===��false Ϊ ==��
		 *
		 * @return {array}
		 **/
		eachCondition: function ( cond ) {
			var result = [],
				array = [];

			// �����ַ��������ж��Ƿ��ж��ֵ
			if ( !!cond.value && typeof cond.value == 'string' )
				array = cond.value.split('|');	// ת��Ϊ�����ʽ

			// �����ֵ�������
			else if ( !cond.value || cond.value.constructor != Array ) {
				array = [cond.value];			// ת��Ϊ�����ʽ
			}

			// ����ȫ��������������һ��������Ӧ���ֵ�����
			each(array, function(i, val){

				// ���ø�ʽ��Ĭ��ֵ
				var rule = {
						key: cond.key || '',
						val: val,
						mode: cond.mode || '==',
						enable: typeof cond.enable == 'boolean' ? cond.enable : true,	// �Ƿ����ã�Ĭ�ϣ�true
						strict: cond.strict || false									// �Ƿ��ϸ�ƥ�䣬Ĭ�ϣ�false
					};

				// ���������ַ�
				if ( rule.key == '*' )
					rule.key = '';

				if ( rule.val == '*' )
					rule.val = '';

				// ��ʽ���ַ�����ȥ�ո�
				if ( typeof rule.key == 'string' )
					rule.key = rule.key.trim();

				if ( typeof rule.val == 'string' )
					rule.val = rule.val.trim();

				// ���٣��ַ�������ѯʱ�����������ֵΪ����ֵ��null��undefined��������ֵ��false������ֵ��0��ת��Ϊ���ַ�
				if ( !rule.strict )
					rule.val = rule.val || '';

				// ��ʼ��������ʽ��ֵ
				result.push(rule);
			});

			return result;
		},

		/**
		 * ��������ַ���
		 *
		 * @param {string} cond
		 * @return {array}
		 **/
		parseByString: function ( cond ) {
			var result = [],
				array = cond ? cond.toString().split(',') : [''];	// ���û����Ҫ�������ַ������򷵻ش�һ�����ַ���������

			// ����ȫ������
			each(array, function(i, value){
				var mode = NArray.getInquiry(value),
					item = value.split(mode),
					cond = {
						key: item[0], 
						value: item[1], 
						mode: mode
					};

				// ��û���������ŵ�����£���ƥ��ȫ����ֵ
				if ( typeof cond.value == 'undefined' ) {
					cond.value = cond.key || '';
					cond.key = '';
				}

				// �����ͳ�ʼ��������
				result = result.concat(NArray.eachCondition(cond));
			});

			return result;
		},

		/**
		 * ������ϸ����������
		 *
		 * @param {array|object} value
		 * @return {array}
		 **/
		parseByObject: function ( value ) {
			var result = [],
				array = value;

			// �������Ϊ������������ת��Ϊ����
			if ( array.constructor !== Array )
				array = [value];

			// ����ȫ������
			each(array, function(i, val){
				result = result.concat(NArray.eachCondition(val));
			});

			return result;
		},

		/**
		 *  �ж��������ͺ͸���������ö��������н���
		 **/
		parseCondition: function ( value ) {
			var result = [];

			// �ַ�����ѯ����������ʽ���������ͣ��ַ��������֡���������ֵ��null��undefined��
			if ( ['string', 'boolean', 'number'].indexOf(typeof value) >= 0 || value === null || value === undefined ) {
				value = NArray.setSpecialValue(value);	// �����ַ������ͣ�ת��Ϊ�ַ���
				result = NArray.parseByString(value);
			}

			// ��ϸ�����󡢶������飩��ѯ����������ʽ
			else if ( value.constructor == Array || value.constructor == Object ) {
				result = NArray.parseByObject(value);
			}

			return result;
		},

		/***************************************************************
		 *  ����ָ���ģ����������ݣ���ʽ���Ƿ�����ƥ�䣬�������ƥ��
		 *  ��ʽ������
		 *  �����ݽ�������ƥ���ѯ��method='get'��
		 *  �����ݽ���ģ����ѯ��method='search';
		 *  ֧��������
		 *  <,>,>=,<=,=,!=
		 **/
		mateEnter: function ( datas, condition, method, whole ) {
			var result = [];

			// �ж��Ƿ�Ϊ�ϸ��ѯ
			if ( whole )
				method = 'whole ' + method;

			// ȷ������Ϊ��������
			if ( datas.constructor != Array )
				datas = [datas];

			// ��ʼ����ѯ·��
			result.constructor.prototype.$path = [];

			// ��¼ѭ������
			NArray.log.cycles = 0;

			// �жϺͽ�������
			condition = NArray.parseCondition(condition);

			// �ж��Ƿ�������
			if ( datas )
				NArray.mateDepth(method, condition, datas, result);

			return result;
		},

		// ��Ȳ�ѯ���ݣ�������ݵ�ֵ�Ƕ������ͣ���ݹ����
		// Return {array}
		mateDepth: function ( method, condition, datas, result, paths, keys, key ) {
			var newPaths = [],
				newKeys = [];

			// ��ʼ��·������
			NArray.extend(newKeys, keys || []);
			NArray.extend(newPaths, paths || []);

			// ƥ�������������
			if ( datas && [Function, Object, Array].indexOf(datas.constructor) > -1 ) {
				typeof key != 'undefined' && newKeys.push(key);
				newPaths.push(datas);

				// �жϵ�ǰֵ�Ƿ���������������������򱣴����ݷ���ֵ���Լ���Ӧ��·������
				if ( NArray.mateCondition(method, datas, condition) ) {
					result.push(newPaths[newPaths.length-1]);
					result.constructor.prototype.$path.push({
						key: newKeys,
						value: newPaths
					});
				}

				// �ݹ����ж������ͣ�����Ͷ�������
				each(datas, function( i, data ){
					NArray.mateDepth(method, condition, data, result, newPaths, newKeys, key);
				});
			}
		},

		// ƥ������
		// Return {boolean}
		mateCondition: function ( method, datas, condition ) {
			var result = false,
				rights = 0;

			// ѭ����������
			each(condition, function(i, param){

				// ����������������ѯ�����Ƕ�����������
				if ( param.key && typeof datas == 'object' ) {
					each(datas, function(key, data){
						return result = (NArray.mateKeys(key, param, method) && NArray.mateValues(data, param, method));
					});
				}

				// �������û�м�ֵ
				else if ( !param.key && typeof datas == 'object' ) {
					each(datas, function(i, data){
						return result = NArray.mateValues(data, param, method);
					});
				}

				// ���������ֱ��ƥ��ֵ
				else {
					result = NArray.mateValues(datas, param, method);
				}

				// �ж��Ƿ�Ϊ�������ϸ�ƥ��
				if ( result && method.indexOf('whole') >= 0 )
					result = ++rights == condition.length;

				return result;
			});

			return result;
		},

		// �����������ж�ֵ�Ƿ�ƥ��
		// Return {boolean}
		mateKeys: function ( key, param, method ) {
			param.key = param.key.toLocaleLowerCase();
			key = String(key).toString().toLocaleLowerCase();

			return method.indexOf('get') >= 0 ?
				key === param.key :
				key.indexOf(param.key) >= 0;
		},

		// �����������ж�ֵ�Ƿ�ƥ��
		// Return {boolean}
		mateValues: function ( value, cond, method ) {
			var result = false;

			// �������ͨ���ַ������٣�ƥ�䣬������ݽ��д���ȷ����Сд���ַ������ݣ�
			if ( !cond.strict ) {
				value = NArray.setSpecialValue(value);
				cond.val = NArray.setSpecialValue(cond.val);

			// ������ϸ�ģʽ���Ա���ѯ�����ݽ��д���
			} else {

				// �����ģ����ѯ����ǿ�н���ѯ����ת��Ϊ�ַ���
				if ( method == 'search' )
					value = JSON.stringify(value);
			}

			// �Ƿ���Ч
			if ( !cond.enable )
				return result;

			// ����������ݲ��ܽ���ƥ��
			// ����������ݵ�ֵΪ null�����տ��ַ�����ƥ��
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
		��չĿ��
	************************************/
	NArray.extend(array, {

		// ƥ���ѯ
		$get: function ( value, whole ) {
			return NArray.mateEnter(this, value, 'get', whole);
		},

		// ģ����ѯ
		$search: function ( value, whole ) {
			return NArray.mateEnter(this, value, 'search', whole);
		},

		// �����ݽ��������޸Ļ���չ
		$update: function ( value ) {
			return NArray.update(this, value);
		},

		// ��ѯ�����·��
		$path: []
	});

	// �������������������ȫ�ֱ���
	if ( window )
		window.nArray = NArray;
}));