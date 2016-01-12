# nArray
> 前端数据管理工具。<br />
> 只需引用文件，便会自动对数组进行功能扩展。<br/>

### 1、获取数据（主要功能）：[].$get();

此方法返回新的数据。

##### $get - 参数：
> @param {string} 获取条件，多个条件之间用 `,` 逗号隔开。一个条件由： 条件键 + 条件符号 + 匹配值。
> @param {boolean} 是否必须满足全部条件，默认：false
> @return {array}

##### $get - 参数说明：
* 键：数据是对象或数组时有效，选填。
* 符号：包括 `<`, `>`, `<=`, `>=`, `!=`, `=` ，此部分如果不填则会使用 `=`。
* 值：需要搜索的内容，一个键对应多个值时，可以使用 `|` 链接。

##### $get - 实例：
```javascript
// 在执行前，请记得引用文件。
<script src="./narray.min-0.1.js"></script>

// 不同类型的数据
var names = [
		{
			id: 1,
			text: '人人为我,我为人人.',
			name: {
				en: 'Dumas pere',
				zh: '大仲马'
			}
		},
		{
			id: 2,
			text: '手中的一只鸟胜于林中的两只鸟.',
			name: {
				en: 'Heywood',
				zh: '希伍德'
			}
		},
		{
			id: 3,
			text: '易得者亦易失.',
			country: '[美]',
			name: {
				en: 'Hazlitt',
				zh: '赫斯特'
			}
		},
		{
			id: 4,
			text: '时间就是金钱.',
			country: '[美]',
			name: {
				en: 'Benjamin Franklin',
				zh: '富兰克林'
			}
		},
		{
			id: 5,
			text: '伟大的人物总是愿意当小人物的.',
			name: {
				en: 'R. W. Emerson',
				zh: '爱默生'
			}
		}
    ];


// 以下几种方式结果一样
names.$get('1, 2, 5');		
// -> [
//		{ id: 1, text: '人人为我,我为人人.', country: '[法]', name: {en: 'Dumas pere', zh: '大仲马'} },
//		{ id: 2, text: '手中的一只鸟胜于林中的两只鸟.', name: {en: 'Heywood', zh: '希伍德'} },
//		{ id: 5, text: '伟大的人物总是愿意当小人物的.', name: {en: 'R. W. Emerson', zh: '爱默生'} }
// 	]

names.$get('id=1, id=2, id=5');	// 效果同上

names.$get('id=1|2|5');			// 效果同上

names.$get('id<3, id>4');		// 效果同上

names.$get('id=1, name=Mary, alias=贝蒂');	// 效果同上

// 传入数组查询
var ids = [1, 2, 5];
names.$get('id=' + ids.join('|'));	// 效果同上
```

### 2、搜索数据（主要功能）：[].$search();

$get 为匹配条件获取数据，而 $search 为模糊搜索相关的数据，它的参数和 $get 的完全一样。<br/>
此方法返回新的数据。

##### $search - 实例（数据沿用 $get 的）：
```javascript
// 以下几种 $search 获取的数据一样
names.$search('美');
// -> [
//		{ id: 3, text: '易得者亦易失.', country: '[美]', name: {en: 'Hazlitt', zh: '赫斯特'} },
//		{ id: 4, text: '时间就是金钱.', country: '[美]', name: {en: 'Benjamin Franklin', zh: '富兰克林 '} }
// 	]

names.$search('country=美');	// 效果同上

names.$search('country=*');		// 效果同上，只查询有 country 值的数据

// 获取全部对象类数据
names.$search('*');
```

### 3、数据批量更新：[].$update();

请注意，此方法会修改当前操作的数据。

##### $update - 参数：
```javascript
@param {*} 新值
@return {array} 更新过后的数据
```

##### $update - 实例（数据沿用 $get 的）：
```javascript
names.$get('id=2|5').$update({ country: '[美]' });
//  [
//		{ id: 2, text: '手中的一只鸟胜于林中的两只鸟.', name: {en: 'Heywood', zh: '希伍德'} },
//		{ id: 5, text: '伟大的人物总是愿意当小人物的.', name: {en: 'R. W. Emerson', zh: '爱默生'} }
// 	]
//
// -> [
//		{ id: 2, text: '手中的一只鸟胜于林中的两只鸟.', country: '[美]', name: {en: 'Heywood', zh: '希伍德'} },
//		{ id: 5, text: '伟大的人物总是愿意当小人物的.', country: '[美]', name: {en: 'R. W. Emerson', zh: '爱默生'} }
// 	]
```

### 4、查看数据路径（唯一的属性）：[].$path;

因为支持深度查询，所有为了更好的跟踪数据而提高的方法。<br/>
此参数为一个对象数组，路径数据位置对应获取的数据位置。

##### $path - 实例（数据沿用 $get 的）：
```javascript
console.log( names.$search('希伍德').$path );
// -> [
//		{
//			key: [ 1, 'name' ],		// 此为内容深度查询中的对应key值
//			value: [
//				[
//					{ id: 1, text: '人人为我,我为人人.', name: {en: 'Dumas pere', zh: '大仲马'} },
//					{ id: 2, text: '手中的一只鸟胜于林中的两只鸟.', name: {en: 'Heywood', zh: '希伍德'} },
//					{ id: 3, text: '易得者亦易失.', country: '[美]', name: {en: 'Hazlitt', zh: '赫斯特'} },
//					{ id: 4, text: '时间就是金钱.', country: '[美]', name: {en: 'Benjamin Franklin', zh: '富兰克林'} },
//					{ id: 5, text: '伟大的人物总是愿意当小人物的.', name: {en: 'R. W. Emerson', zh: '爱默生'} }
//				],
//				{ 
//					id: 2, 
//					text: '手中的一只鸟胜于林中的两只鸟.',
//					name: {en: 'Heywood', zh: '希伍德'}
//				},
//				{
//					en: 'Heywood',
//					zh: '希伍德'
//				}
//			]
//		}
// 	]
```

### 关联Array文档
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array
<br/>
<br/>
<br/>
<hr/>
###0.3 说明：

#####优化：

* 1、重构功能框架，实现一个对象管理前端全部数据，因为获取的数据只会是引用类型数据：对象、数据、函数。


#####变动：

* 1、移除绑定到数组原型上的方法：$unique(去重复)、$fetch（提取需要的值），如果需要使用，可以在 nArray 上调用进行使用。

* 2、对使用到的方法，如果ES6中有的，则采用原生扩展方式，而非定义在 nArray上。包括：indexOf、keys、trim。

* 3、优化了部分代码，删除了重复内容。

* 4、因为采用必报是封装功能，压缩后的文件更小了。

* 5、优化了 $path 属性，当前 key 的数组值于 value 的数组值更具对应关系。


#####提示：

* 1、功能小提示，非数组数据使用 [ ] 包裹数据后便可使用功能。

* 2、可实现一个对象变量管理前端全部数据，因为获取的数据只会是引用类型数据：对象、数据、函数。




