# nArray
> 文件为扩展数组的一个小工具，为了帮助你更好的管理你的数据。

### 获取数据（主要功能）
```javascript
[].$get();
```

##### $get - 参数说明：
```javascript
@ {string} 获取条件，多个条件之间用 `,` 逗号隔开。一个条件由： 条件键 + 条件符号 + 匹配值。
@ {boolean} 是否必须满足全部条件，默认：false
```

##### $get - 参数说明 - 获取条件详细说明：
* 条件键：数据是对象或数组时有效，选填。
* 条件符号：包括 `<`, `>`, `<=`, `>=`, `!=`, `=` ，此部分如果不填则会使用 `=`。
* 匹配指：需要搜索的内容。

##### $get - 实例：
```javascript
// 在执行前，请记得引用文件。
<script src="./narray.min-0.1.js"></script>

// 不同类型的数据
var testData1 = [1, 2, 3, 4, 5],
    testData2 = [['a', 'b', 'c'], ['a', 'b', 'c']],
    testData3 = [
        {
            id: 1,
            name: 'a',
            remark: 'test'
        },
        {
            id: 2,
            name: 'bb',
            remark: 'hello'
        },
        {
            id: 3,
            name: 'ccc',
            remark: 'world'
        }
    ];

	testData1.$get('>3');	// -> [4, 5]

	testData1.$get('!=3');	// -> [1, 2, 4, 5]

	// 在对象数据中查询，以下三种方式结果一样
	testData2.$get('1, 2');	// -> {id: 1, name: 'a', remark: 'test'}, {id: 2, name: 'bb', remark: 'hello'},

	testData2.$get('id=1, id=2');	// 效果同上

	testData2.$get('id=1|2');		// 效果同上
```




### 搜索数据（主要功能）

```javascript
[].$search();
```

### 数据去重复

```javascript
[].$fetch();
```

### 数据内容抽取

```javascript
[].$fetch();
```

### 数据批量更新

```javascript
[].$update();
```
