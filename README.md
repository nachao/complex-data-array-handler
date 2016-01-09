# nArray
> 文件为扩展数组的一个小工具，为了帮助你更好的管理你的数据。

### 获取数据（主要功能）
```javascript
[].$get();
```
> 此方法返回新的数据。

##### $get - 参数：
```javascript
@param {string} 获取条件，多个条件之间用 `,` 逗号隔开。一个条件由： 条件键 + 条件符号 + 匹配值。
@param {boolean} 是否必须满足全部条件，默认：false
@return {array}
```

##### $get - 参数说明：
* 键：数据是对象或数组时有效，选填。
* 符号：包括 `<`, `>`, `<=`, `>=`, `!=`, `=` ，此部分如果不填则会使用 `=`。
* 值：需要搜索的内容，一个键对应多个值时，可以使用 `|` 链接。

##### $get - 实例：
```javascript
// 在执行前，请记得引用文件。
<script src="./narray.min-0.1.js"></script>

// 不同类型的数据
var testData1 = [1, 2, 3, 4, 5],
    testData2 = [
		{
			id: 1,
			name: 'Sunny',
			alias: '莎妮'
		},
		{
			id: 2,
			name: 'Mary',
			alias: '玛丽',
		},
		{
			id: 3,
			name: 'Crystal',
			alias: '克里丝塔',
			remark: '冰雪聪明的'
		},
		{
			id: 4,
			name: 'Cindy',
			alias: '辛迪',
			remark: '甜美'
		},
		{
			id: 5,
			name: 'Betty',
			alias: '贝蒂'
		}
    ];

testData1.$get('>3');	// -> [4, 4, 5]

testData1.$get('!=3');	// -> [1, 2, 2, 4, 4, 5]

// 在对象数据中查询，以下几种方式结果一样
testData2.$get('1, 2, 5');		
// -> [
//		{id: 1, name: 'Sunny', alias: '莎妮'},
//		{id: 2, name: 'Mary', alias: '玛丽', }, 
//		{id: 5, name: 'Betty', alias: '贝蒂'}
// 	]

testData2.$get('id=1, id=2, id=5');	// 效果同上

testData2.$get('id=1|2|5');		    // 效果同上

testData2.$get('id<3, id>4');		// 效果同上

// 传入数组查询
var ids = [1, 2, 5];
testData2.$get('id=' + ids.join('|'));	// 效果同上
```

### 搜索数据（主要功能）

```javascript
[].$search();
```
> $get 获取的数据为返回完全匹配条件值的数据。
> 而 $search 则可以模糊搜索相关的数据，它的参数和 $get 的完全一样。
> 此方法返回新的数据。

##### $search - 参数（同 $get 相同）：
```javascript
@param {string} 获取条件，多个条件之间用 `,` 逗号隔开。一个条件由： 条件键 + 条件符号 + 匹配值。
@param {boolean} 是否必须满足全部条件，默认：false
@return {array}
```

##### $search - 实例（数据沿用 $get 的）：
```javascript
// 以下几种 $search 获取的数据一样
testData2.$search('c');
// -> [
//		{id: 3, name: 'Crystal', alias: '克里丝塔', remark: '冰雪聪明的'}, 
//		{id: 4, name: 'Cindy', alias: '辛迪', remark: '甜美'},
// 	]

testData2.$search('name=c');	// 效果同上

testData2.$search('remark=');	// 效果同上，只查询有 remark 值的数据
```

### 数据内容抽取

```javascript
[].$fetch();
```
> 此方法只有在数据是数组或者对象的情况下有效。
> 此方法返回新的数据。

##### $fetch - 参数：
```javascript
@param {string} 需要抽出的键值，多个用 `,` 逗号隔开。
@return {array} 去重复后的数据
```

##### $search - 实例（数据沿用 $get 的）：
```javascript
// 只输出 name 和 alias 两个值
testData2.$fetch('name, alias');
// -> [
//		{"name":"Sunny","alias":"莎妮"},
//		{"name":"Mary","alias":"玛丽"},
//		{"name":"Crystal","alias":"克里丝塔"},
//		{"name":"Cindy","alias":"辛迪"},
//		{"name":"Betty","alias":"贝蒂"}
//	]
```

### 数据去重复

```javascript
[].$unique();
```
> 此方法返回新的数据。

##### $update - 参数（无参数）：
```javascript
@return {array} 去重复后的数据
```

##### $unique - 实例（数据沿用 $get 的）：
```javascript
testData1.$get('>=3').$unique();  // [3, 3, 3, 4, 4, 5] -> [3, 4, 5]
```

### 数据批量更新

```javascript
[].$update();
```
> 请注意，此方法会修改数组数据。

##### $update - 参数：
```javascript
@param {*} 新值
@return {array} 更新过后的数据
```

##### $update - 实例（数据沿用 $get 的）：
```javascript
testData2.$get('id=1|5').$update({ name: 'Zara', alias: '赞拉' });
// -> [
//		{id: 1, name: 'Zara', alias: '赞拉'},
//		{id: 5, name: 'Zara', alias: '赞拉'}
// 	]
```
