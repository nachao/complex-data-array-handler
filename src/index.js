'use strict'

const /**
        *  全部条件符号
        *
        *  说明：处于对编程习惯考虑的原因“等于匹配符号”添加了一个双等于号（==），
        *  它和单等于号（=）完全一样。
        *  因为此工具已经有被项目使用，所有不删除 = 符号，两个都可以正常使用。
        *
        *  提示：strict（精确匹配）参数只有条件符号为：'==' 是有效；
        */
    caseSign = ['<=', '>=', '<', '>', '!=', '==', '=']

// const log = {
//     cycles = 0
// }

// 遍历数组或对象元素，回调返回 true 则终止循环
// @return {boolean}
function each(datas, fn, t) {
    var log = [],
        result,
        j

    for (j in datas) {
        // log.cycles += 1

        if (
            datas.hasOwnProperty(j) &&
            log.indexOf(datas[j]) < 0 &&
            (result = fn(j, datas[j]))
        )
            break

        if (typeof datas[j] == 'object') log.push(datas[j])
    }

    return !!result
}

    // 更新数组数据
function update(datas, value) {
    if (typeof value != 'undefined' && datas.constructor === Array) {
        each(datas, function(i, data) {
            if ('object' == typeof value) Object.assign(data, value)
            else if (
                'function' == typeof value &&
                value.call(data, datas.$path[i])
            )
                Object.assign(data, value.call(data, datas.$path[i]))
        })
    }
    return datas
}

// 对数据进行去重复处理（建议只用于非对象数据）
function unique(datas) {
    var result = []

    each(datas, function(i, data) {
        if (result.indexOf(data) < 0) result.push(data)
    })

    return result
}

/***********************************************************
 * 判断字符串中是否有条件符号，如果有则返回，
 * 如果不给判断值，则返回默认条件符号 ‘==’。
 *
 * @param {string} value = 判断此值是否在匹配符号中，选填
 * @return {string}
 **/
function getInquiry(value) {
    // var result = '==';
    var reg = new RegExp(caseSign.join('|'))

    // 输出循环次数
    // console.log(caseSign.join('|'));

    // if ( value ) {
    // 	each(caseSign, function(i, sign){
    // 		if ( value.indexOf(sign) >= 0 ) {
    // 			result = sign;
    // 			return true;
    // 		}
    // 	});
    // }

    // return result;

    return reg.exec(value) ? reg.exec(value)[0] : '=='
}

/**
 * 如果是快速（字符串）匹配，则将数据值和条件值都转换为字符串，其转换为小写；
 * 以及处理特殊数据为空字符串
 *
 * @param {*} value = 判断此值是否在匹配符号中，选填
 * @return {string}
 **/
function setSpecialValue(value) {
    var result = ''

    if (value !== null && value !== undefined)
        result = value.toString().toLocaleLowerCase()

    return result
}

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
function eachCondition(cond) {
    var result = [],
        array = []

    // 输出循环次数
    // console.log(NArray.log.cycles, cond);

    // 处理字符串类型判断是否有多个值
    if (!!cond.value && typeof cond.value == 'string')
        array = cond.value.split('|')
    // 转换为数组格式
    // 处理空值或非数组
    else if (!cond.value || cond.value.constructor != Array) {
        array = [cond.value] // 转换为数组格式
    }

    // 遍历全部此条件，处理一个条件对应多个值的情况
    each(array, function(i, val) {
        // 设置格式和默认值
        var rule = {
            key: cond.key || '',
            val: val,
            mode: cond.mode || '==',
            enable:
                typeof cond.enable == 'boolean' ? cond.enable : true, // 是否启用，默认：true
            strict: cond.strict || false, // 是否严格匹配，默认：false
        }

        // 处理特殊字符
        if (rule.key == '*') rule.key = ''

        if (rule.val == '*') rule.val = ''

        // 格式化字符串（去空格）
        if (typeof rule.key == 'string') rule.key = rule.key.trim()

        if (typeof rule.val == 'string') rule.val = rule.val.trim()

        // 快速（字符串）查询时，如果将条件值为：空值（null、undefined）、布尔值（false）、数值（0）转换为空字符
        if (!rule.strict) rule.val = rule.val || ''

        // 初始化条件格式和值
        result.push(rule)
    })

    return result
}

/**
 * 拆分条件字符串
 *
 * @param {string} cond
 * @return {array}
 **/
function parseByString(cond) {
    var result = [],
        array = cond ? cond.toString().split(',') : [''] // 如果没有需要解析的字符串，则返回带一个空字符串的数组

    // 输出循环次数
    // console.log(NArray.log.cycles, array);

    // 遍历全部条件
    each(array, function(i, value) {
        var mode = getInquiry(value),
            item = value.split(mode),
            cond = {
                key: item[0],
                value: item[1],
                mode: mode,
            }

        // 在没有条件符号的情况下，则匹配全部键值
        if (typeof cond.value == 'undefined') {
            cond.value = cond.key || ''
            cond.key = ''
        }

        // 遍历和初始条件参数
        result = result.concat(eachCondition(cond))
    })

    return result
}

/**
 * 解析详细（对象）条件
 *
 * @param {array|object} value
 * @return {array}
 **/
function parseByObject(value) {
    var result = [],
        array = value

    // 如果条件为单个对象，则将其转换为数组
    if (array.constructor !== Array) array = [value]

    // 遍历全部条件
    each(array, function(i, val) {
        result = result.concat(eachCondition(val))
    })

    return result
}

/**
 *  判断条件类型和根据相关配置对条件进行解析
 **/
function parseCondition(value) {
    var result = []

    // 字符串查询条件解析方式，包括类型：字符串、数字、布尔、空值（null、undefined）
    if (
        ['string', 'boolean', 'number'].indexOf(typeof value) >= 0 ||
        value === null ||
        value === undefined
    ) {
        value = setSpecialValue(value) // 将非字符串类型，转换为字符串
        result = parseByString(value)
    }

    // 详细（对象、对象数组）查询条件解析方式
    else if (
        value.constructor == Array ||
        value.constructor == Object
    ) {
        result = parseByObject(value)
    }

    return result
}

/**
 *  给结果输出数据绑定一些扩展属性
 **/
function bindAttr(data, path, key) {
    if (path[path.length - 2] && !data.$parent) {
        // 父级数据
        Object.defineProperty(data, '$parent', {
            value: path[path.length - 2],
        })
    }

    if (key && !data.$parentKey) {
        // 父级数据名称，或键值
        Object.defineProperty(data, '$parentKey', {
            value: key,
        })
    }

    if (path[path.length - 2] && key && !data.$parentGet) {
        // 获取指定名的父级，没有则返回空值
        Object.defineProperty(data, '$parentGet', {
            value: function(parentKey) {
                var data = this,
                    result = null

                while (data.$parent && !result) {
                    data = data.$parent
                    result = data[parentKey]
                }

                return result
            },
        })
    }
}

/***************************************************************
 *  根据指定的：条件，数据，方式，是否完整匹配，进行深度匹配
 *  方式包括：
 *  对数据进行完整匹配查询，method='get'；
 *  对数据进行模糊查询：method='search';
 *  支持条件：
 *  <,>,>=,<=,=,!=
 **/
function mateEnter(datas, condition, method, whole) {
    var result = []

    // 判断是否为严格查询
    if (whole) method = 'whole ' + method

    // 确保数据为数组类型
    if (datas.constructor != Array) datas = [datas]

    // 初始化数组对象，进行扩展
    // 绑定路径属性
    Object.defineProperty(result, '$path', {
        value: [],
    })

    // 记录循环次数
    // NArray.log.cycles = 0

    // 输出循环次数
    // console.log(NArray.log.cycles);

    // 判断和解析条件
    condition = parseCondition(condition)

    // 输出循环次数
    // console.log(NArray.log.cycles);

    // 判断是否有数据
    if (datas) mateDepth(method, condition, datas, result)

    // 输出循环次数
    // console.log(NArray.log.cycles);

    return result
}

// 深度查询数据，如果数据的值是对象类型，则递归调用
// Return {array}
function mateDepth(
    method,
    condition,
    datas,
    result,
    paths,
    keys,
    key
) {
    var newPaths = Object.assign([], paths),
        newKeys = Object.assign([], keys)

    // 匹配对象类型数据
    if (
        datas &&
        [Function, Object, Array].indexOf(datas.constructor) > -1
    ) {
        // 如果有键值，则存储
        if (typeof key != 'undefined') {
            newKeys.push(key)
        }

        // 存储数据到层级关系中
        newPaths.push(datas)

        // 给每层数据绑定扩展数据
        bindAttr(datas, newPaths, key)

        // 判断当前值是否满足给定的条件，满足则保存数据返回值，以及对应的路径数据
        if (mateCondition(method, datas, condition)) {
            result.push(newPaths[newPaths.length - 1])
            result.$path.push({
                key: newKeys,
                value: newPaths,
            })
        }

        // 递归所有对象类型（数组和对象）数据
        each(datas, function(key, data) {
            if (typeof data == 'object') {
                mateDepth(
                    method,
                    condition,
                    data,
                    result,
                    newPaths,
                    newKeys,
                    key
                )
            }
        })
    }
}

// 匹配条件
// Return {boolean}
function mateCondition(method, datas, condition) {
    var result = false,
        rights = 0

    // 循环所以条件
    each(condition, function(i, param) {
        // 条件有主键，被查询数据是对象类型数据
        if (param.key && typeof datas == 'object') {
            // 如果有搜索主键，则直接匹配，
            if (param.key) {
                return (result =
                    Object.keys(datas).indexOf(param.key) > -1 &&
                    mateValues(datas[param.key], param, method))
            }

            // 没有主键，则需要循环全部数据
            else {
                each(datas, function(key, data) {
                    return (result = mateValues(
                        data,
                        param,
                        method
                    ))
                })
            }
        }

        // 如果数据没有键值
        else if (!param.key && typeof datas == 'object') {
            each(datas, function(i, data) {
                return (result = mateValues(data, param, method))
            })
        }

        // 其他情况，直接匹配值
        else {
            result = mateValues(datas, param, method)
        }

        // 判断是否为多条件严格匹配
        if (result && method.indexOf('whole') >= 0)
            result = ++rights == condition.length

        return result
    })

    return result
}

// 根据条件，判断值是否匹配
// Return {boolean}
function mateKeys(key, param, method) {
    param.key = param.key.toLocaleLowerCase()
    key = String(key)
        .toString()
        .toLocaleLowerCase()

    return method.indexOf('get') >= 0
        ? key === param.key
        : key.indexOf(param.key) >= 0
}

// 根据条件，判断值是否匹配
// Return {boolean}
function mateValues(value, cond, method) {
    var result = false

    // 如果是普通（字符串快速）匹配，则对数据进行处理（确保是小写的字符串内容）
    if (!cond.strict) {
        value = setSpecialValue(value)
        cond.val = setSpecialValue(cond.val)

        // 如果是严格模式，对被查询的数据进行处理
    } else {
        // 如果是模糊查询，则强行将查询数据转换为字符串
        if (method == 'search') value = JSON.stringify(value)
    }

    // 是否生效
    if (!cond.enable) return result

    // 对象或函数数据不能进行匹配
    // 如果数据内容的值为 null，则按照空字符串来匹配
    if (
        ['object', 'function'].indexOf(typeof value) >= 0 &&
        value != null
    )
        return result

    switch (cond.mode) {
        case '=':
        case '==':
            result =
                method.indexOf('get') >= 0
                    ? cond.strict
                        ? value === cond.val
                        : value == cond.val
                    : value.indexOf(cond.val) >= 0
            break

        case '!=':
            result =
                method.indexOf('search') >= 0
                    ? value.indexOf(cond.val) < 0
                    : value !== cond.val
            break

        default:
            result = eval(
                '"' + value + '"' + cond.mode + '"' + cond.val + '"'
            )
    }

    return result
}

export function arrayGet(data, value, whole) {
    return mateEnter(data, value, 'get', whole)
}

export function arraySet(data, value) {
    return update(data, value)
}

export function arraySearch(data, value, whole) {
    return mateEnter(data, value, 'search', whole)
}

const Cdah = {
    arrayGet,
    arraySet,
    arraySearch
}

export default Cdah
