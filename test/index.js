const assert = require('assert')
const cdah = require('../src/index')

// ====

// 测试数据
const sayings = [
  {
    id: 1,
    text: '人人为我,我为人人.',
    name: {
      en: 'Dumas pere',
      zh: '大仲马',
    },
  },
  {
    id: 2,
    text: '手中的一只鸟胜于林中的两只鸟.',
    name: {
      en: 'Heywood',
      zh: '希伍德',
    },
  },
  {
    id: 3,
    text: '易得者亦易失.',
    country: '[美]',
    name: {
      en: 'Hazlitt',
      zh: '赫斯特',
    },
  },
  {
    id: 4,
    text: '时间就是金钱.',
    country: '[美]',
    name: {
      en: 'Benjamin Franklin',
      zh: '富兰克林',
    },
  },
  {
    id: 5,
    text: '伟大的人物总是愿意当小人物的.',
    name: {
      en: 'R. W. Emerson',
      zh: '爱默生',
    },
  },
]

// ====

const getExpect = [
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
    id: 5,
    text: '伟大的人物总是愿意当小人物的.',
    name: { en: 'R. W. Emerson', zh: '爱默生' },
  },
]

it('verify cdah.get() return', function() {
  const result = cdah.get(sayings, '1')
  assert.ok(Array.isArray(result))
  assert.strictEqual(result.length, 1)
  assert.strictEqual(typeof result[0], 'object')
  assert.strictEqual(result[0].id, 1)
})

it("execute cdah.get('1,2,5')", function() {
  assert.deepStrictEqual(cdah.get(sayings, '1,2,5'), getExpect)
})

it("execute cdah.get('id=1,id=2,id=5')", function() {
  assert.deepStrictEqual(
    cdah.get(sayings, 'id=1,id=2,id=5'),
    getExpect
  )
})

it("execute cdah.get('id=1|2|5')", function() {
  assert.deepStrictEqual(cdah.get(sayings, 'id=1|2|5'), getExpect)
})

it("execute cdah.get('id<3,id>4')", function() {
  assert.deepStrictEqual(cdah.get(sayings, 'id<3,id>4'), getExpect)
})

// ===

const searchExpect = [
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
]

it('verify cdah.search() return', function() {
  const result = cdah.search(sayings, '美')
  assert.ok(Array.isArray(result))
  assert.strictEqual(result.length, 2)
  assert.strictEqual(typeof result[0], 'object')
  assert.strictEqual(result[0].id, 3)
  assert.strictEqual(result[1].id, 4)
})

it("execute cdah.search('美')", function() {
  assert.deepStrictEqual(cdah.search(sayings, '美'), searchExpect)
})

it("execute cdah.search('country=美')", function() {
  assert.deepStrictEqual(
    cdah.search(sayings, 'country=美'),
    searchExpect
  )
})

it("execute cdah.search('country=*')", function() {
  assert.deepStrictEqual(
    cdah.search(sayings, 'country=*'),
    searchExpect
  )
})

// ====

const setExpect = [
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

it('execute cdah.set()', function() {
  const queryData = cdah.search(sayings, 'id=2|5')
  const copyData = JSON.parse(JSON.stringify(queryData))
  const modifyData = cdah.set(copyData, { country: '[美]' })
  assert.deepStrictEqual(modifyData, setExpect)
})

// ====

const pathExpect = [
  {
    key: ['1', 'name'], // 此为内容深度查询中的对应key值
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

it('verify [].$path', function() {
  const path = cdah.search(sayings, '希伍德').$path
  assert.deepStrictEqual(path, pathExpect)
})

// ====

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

it('execute cdah.get(null)', function() {
  assert.deepStrictEqual(cdah.get(testData, null), [
    { name: null, sn: 't01' },
    { name: undefined, sn: 't02' },
    { name: '', sn: 't07' },
  ])
})

it('execute cdah.get([{ value: null, strict: true }])', function() {
  assert.deepStrictEqual(
    cdah.get(testData, [{ value: null, strict: true }]),
    [{ name: null, sn: 't01' }]
  )
})

it("execute cdah.get([{ value: '1', enable: true }])", function() {
  assert.deepStrictEqual(
    cdah.get(testData,
      [{ value: 1, strict: true, enable: true }, { value: true }]),
      [{ name: 1, sn: 't03' },{ name: true, sn: 't05' }]
  )
})

it("execute cdah.get([{ value: '1', enable: false }])", function() {
  assert.deepStrictEqual(
    cdah.get(testData,
      [{ value: 1, strict: true, enable: false }, { value: true }]),
      [{ name: true, sn: 't05' }]
  )
})
