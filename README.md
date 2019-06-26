> 在前端或 Node 需要大数据集需要查询数据时使用。

[TOC]

## 安装 / 使用

```
yarn add complex-data-array-handler
// or
npm i complex-data-array-handler --dev
```

此工具提供了三个方法和一个扩展属性：

1. 精确查询数据方法：cdah.arrayGet
2. 模糊查询数据方法：cdah.arraySearsh
3. 数据设置方法：cdah.arraySet
4. 数据路径与父级：[].$parent / [].$path

```javascript
const cdah = require('complex-data-array-handler')
```

## cdah.arrayGet(data, condition, [matching]): array

**参数**

| 名称      | 数据类型 | 必填 | 描述                                                                                 |
| --------- | -------- | ---- | ------------------------------------------------------------------------------------ |
| data      | Array    | Yes  | 需要查询的数组。                                                                     |
| condition | String   | Yes  | 查询条件，多个条件之间用 `,` 逗号隔开。单个条件的组成： 条件键 + 条件符号 + 匹配值。 |

> 此方法将返回一个新的数组。

**查询条件说明**

- 键：数据是对象或数组时有效，选填。
- 符号：包括 `<`, `>`, `<=`, `>=`, `!=`, `=` ，此部分如果不填则会使用 `=`。
- 值：需要搜索的内容，一个键对应多个值时，可以使用 `|` 链接。

**例子**

以下为测试数据：

```javascript
const sayings = [
  {
    id: 1,
    text: '人人为我,我为人人.',
    name: { en: 'Dumas pere', zh: '大仲马' },
  },
  {
    id: 2,
    text: '手中的一只鸟胜于林中的两只鸟.',
    name: { en: 'Heywood', zh: '希伍德' },
  },
  {
    id: 3,
    text: '易得者亦易失.',
    country: '[美]',
    name: { en: 'Hazlitt', zh: '赫斯特' },
  },
  {
    id: 4,
    text: '时间就是金钱.',
    country: '[美]',
    name: { en: 'Benjamin Franklin', zh: '富兰克林' },
  },
  {
    id: 5,
    text: '伟大的人物总是愿意当小人物的.',
    name: { en: 'R. W. Emerson', zh: '爱默生' },
  },
]
```

假设我们需要获得如下结果：

```javascript
;[
  {
    id: 1,
    text: '人人为我,我为人人.',
    country: '[法]',
    name: { en: 'Dumas pere', zh: '大仲马' },
  },
  {
    id: 2,
    text: '手中的一只鸟胜于林中的两只鸟.',
    name: { en: 'Heywood', zh: '希伍德' },
  },
  {
    id: 5,
    text: '伟大的人物总是愿意当小人物的.',
    name: { en: 'R. W. Emerson', zh: '爱默生' },
  },
]
```

以下几种方式结果一样：

```javascript
cdah.arrayGet(sayings, '1,2,5')

cdah.arrayGet(sayings, 'id=1,id=2,id=5') // 效果同上

cdah.arrayGet(sayings, 'id=1|2|5') // 效果同上

cdah.arrayGet(sayings, 'id<3,id>4') // 效果同上

// 数组条件查询
var ids = [1, 2, 5]
cdah.arrayGet(sayings, 'id=' + ids.join('|')) // 效果同上
```

## cdah.arraySearch(data, condition, [matching]): array

arrayGet 为匹配条件获取数据，而 arraySearch 为模糊搜索相关的数据，它的参数和 arrayGet 的完全一样。

此方法仍然返回一个新的数组。

**例子**

假设需要获取如下数据：

```javascript
;[
  {
    id: 3,
    text: '易得者亦易失.',
    country: '[美]',
    name: { en: 'Hazlitt', zh: '赫斯特' },
  },
  {
    id: 4,
    text: '时间就是金钱.',
    country: '[美]',
    name: { en: 'Benjamin Franklin', zh: '富兰克林 ' },
  },
]
```

以下几种方式效果一样。

```javascript
cdah.arraySearch(sayings, '美')

cdah.arraySearch(sayings, 'country=美') // 效果同上

cdah.arraySearch(sayings, 'country=*') // 效果同上，只查询有 country 值的数据

// 获取全部对象类数据
cdah.arraySearch(sayings, '*')
```

## cdah.arraySet(data, modify): array

这是一个数据批量更新方法，请注意，此方法会修改当前操作的数据。

**例子**

```javascript
const queryData = cdah.arraySearch(sayings, 'id=2|5')
const modifyData = cdah.arraySet(data, { country: '[美]' })
```

修改前：

```javascript
;[
  {
    id: 2,
    text: '手中的一只鸟胜于林中的两只鸟.',
    name: { en: 'Heywood', zh: '希伍德' },
  },
  {
    id: 5,
    text: '伟大的人物总是愿意当小人物的.',
    name: { en: 'R. W. Emerson', zh: '爱默生' },
  },
]
```

修改后的数据：

```javascript
;[
  {
    id: 2,
    text: '手中的一只鸟胜于林中的两只鸟.',
    country: '[美]',
    name: { en: 'Heywood', zh: '希伍德' },
  },
  {
    id: 5,
    text: '伟大的人物总是愿意当小人物的.',
    country: '[美]',
    name: { en: 'R. W. Emerson', zh: '爱默生' },
  },
]
```

## [].$path

针对 JavaScript 数据无法获取父级数据的问题，提供的方案，此属性提供查询的数据具体路径。

因为支持深度查询，所有为了更好的跟踪数据而提高的方法。此参数为一个对象数组，路径数据位置对应获取的数据位置。

**例子**

```javascript
console.log(cdah.arraySearch(sayings, '希伍德').$path)

// 输出以下数据：
;[
  {
    key: [1, 'name'], // 此为内容深度查询中的对应key值
    value: [
      [
        {
          id: 1,
          text: '人人为我,我为人人.',
          name: { en: 'Dumas pere', zh: '大仲马' },
        },
        {
          id: 2,
          text: '手中的一只鸟胜于林中的两只鸟.',
          name: { en: 'Heywood', zh: '希伍德' },
        },
        {
          id: 3,
          text: '易得者亦易失.',
          country: '[美]',
          name: { en: 'Hazlitt', zh: '赫斯特' },
        },
        {
          id: 4,
          text: '时间就是金钱.',
          country: '[美]',
          name: { en: 'Benjamin Franklin', zh: '富兰克林' },
        },
        {
          id: 5,
          text: '伟大的人物总是愿意当小人物的.',
          name: { en: 'R. W. Emerson', zh: '爱默生' },
        },
      ],
      {
        id: 2,
        text: '手中的一只鸟胜于林中的两只鸟.',
        name: { en: 'Heywood', zh: '希伍德' },
      },
      {
        en: 'Heywood',
        zh: '希伍德',
      },
    ],
  },
]
```

添加新的查看格式：详细查询（之前的字符串查询方式任然可用），之前查询条件传入的是字符串，现在可以传入对象数组，详细使用见下面的示例；

**对象查询参数说明：**

```javascript
;[
  {
    key: 'xxx',
    value: 'yyyyy',
    mode: '==',
    enable: true,
    strict: false
  }
]
```

| 属性   | 类型    | 必填 | 描述                                                              |
| ------ | ------- | ---- | ----------------------------------------------------------------- |
| key    | string  | NO   | 要查询的对象属性                                                  |
| value  | any     | NO   | 查询内容值                                                        |
| mode   | string  | NO   | 指定查询方式，包括：'==', '!=', '>', '>=', '<', '<='，默认为 '==' |
| enable | boolean | NO   | 是否生效此条件，方便更新查询条件，默认为 true                     |
| strict | boolean | NO   | 是否严格查询，默认为 false                                        |

## strict（是否严格查询）

```javascript
// 申明测试数据
var testData = [
  {
    name: null,
    sn: 't01',
  },
  {
    name: undefined,
    sn: 't02',
  },
  {
    name: 1,
    sn: 't03',
  },
  {
    name: '1',
    sn: 't04',
  },
  {
    name: true,
    sn: 't05',
  },
  {
    name: false,
    sn: 't06',
  },
  {
    name: '',
    sn: 't07',
  },
]
```

**例子一**

查询特殊值：null。 以下采用两种查询方式：

```javascript
// 1、快速查询（注：null、undefined 都会转换为 ''）：
cdah.arrayGet(testData, null)

// 2、详细查询，和快速查询效果一样：
cdah.arrayGet(testData, [{ value: null }])
```

输出：

```javascript
;[
  { name: null, sn: 't01' },
  { name: undefined, sn: 't02' },
  { name: '', sn: 't07' },
]
```

修改 2、详细方式为 “严格查询”：

```javascript
cdah.arrayGet(testData, [{ value: null, strict: true }])
```

修改后输出：

```javascript
;[{ name: null, sn: 't01' }]
```

**例子二**

查询对比：name 为 1（数字）的数据。

```javascript
// 1、普通方式
cdah.arrayGet(testData, 'name=1')

// 2、详细方式
cdah.arrayGet(testData, [{ key: 'name', value: 1 }])
```

输出：

```javascript
;[{ name: 1, sn: 't03' }, { name: '1', sn: 't04' }]
```

修改 2、详细方式为严格查询：

```javascript
cdah.arrayGet(testData, [
  {
    key: 'name',
    value: 1,
    strict: true,
  },
])
```

修改后输出：

```javascript
;[{ name: 1, sn: 't03' }]
```

> 通过以上可以看出普通查询（字符串查询）是无法区分数据类型的，因此就可以使用详细方式查询。

## enable（是否生效此条件）

多条件查询：'1', true。

```javascript
cdah.arrayGet(testData, [{ value: '1' }, { value: true }])
```

输出：

```javascript
;[{ name: 1, sn: 't03' }, { name: '1', sn: 't04' }, { name: true, sn: 't05' }]
```

关闭第一个条件，在所动态更新时很方便：

```javascript
cdah.arrayGet(testData, [{ value: '1', enable: false }, { value: true }])
```

输出：

```javascript
;[{ name: true, sn: 't05' }]
```

## 组合条件查询

此功能之前是一直支持，在此再补充说明下：

组合条件查询，必须满足：name = 1, sn: 't04' 的数据。
普通查询（遍历数据，只要数据中满足任何一个条件则返回此数据）

```javascript
cdah.arrayGet(testData, [{ value: '1' }, { value: 't04' }])
```

返回值中包含了 sn = 't03' 的数据。

```javascript
;[{ name: 1, sn: 't03' }, { name: '1', sn: 't04' }]
```

组合查询（遍历数据，只要数据中必须满足全部条件则返回此数据）使用方式很简单，执行给出给二个参数为：true 即可（默认为：false）。

```javascript
cdah.arrayGet(testData, [{ value: '1' }, { value: 't04' }], true)
```

输出：

```javascript
;[{ name: '1', sn: 't04' }]
```

## 相关文档

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array
