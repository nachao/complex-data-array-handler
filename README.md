# nArray
> 前端数据管理工具。<br />
> 只需引用文件，便会自动对数组进行功能扩展。<br/>

### 1、获取数据（主要功能）：[].$get();

此方法返回新的数据。

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


###0.4 说明：

#####操作：

* 1、添加新的查看格式：详细查询，之前的字符串查询方式任然可用。和之前不同的是，之前传入的是字符串，现在可以传入对象数组，详细使用见下面的示例。（重要）

#####优化：

* 2、优化开发版的注释以及代码的优化和简化；



#####示例：
```javascipt
[
	{
		key: 'xxx',
	    value: 'yyyyy',
	    mode: '==',
	    enable: true,
		strict: false
	},
	{
		...
	}
]

// 参数说明：以下参数全部为选填。

@param {string} key = 指定键值；
@param {*} value = 标准查询（$get）的话，则需要指定值；模糊查询（$search）的话，只需输入相关的值即可；
@param {string} mode = 指定查询方式，包括：'==', '!=', '>', '>=', '<', '<='。默认为 '=='；
@param {boolean} enable = 是否此条件生效，推荐使用场景：在框架中查询数据时根据指定开关键来查询。默认为 true；
@param {boolean} strict = 是否严格查询。默认为 false；

// 严格查询（strict）参数示例：
var test0_4 = [{ k1:null }, { k2: undefined }, { k3: 1 }, { k4: '1' }, { k5: true } , { k6: false }, { k7: '' }];

// 查询特殊值：null
test0_4 .$get({ value: null });
// 或
test0_4 .$get('');

--> [{"k1":null},{k2:undefined},{"k6":false},{"k7":""}];

// 以上为普通查询，是无法匹配到对应的数据类型。
// 精确的查询特殊值：null 和 1（数字）
test0_4 .$get({ value: null, strict: true });

--> [{"k1":null}];

// 精确的查询特殊值：1（数字），在普通查询中是会把字符串 1 给查询出来的。
test0_4 .$get({ value: 1, strict: true });

--> [{"3":1 }];
```
