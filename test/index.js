const assert = require('assert')
const cdah = require('../dist/index')

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

const arrayGetExpect = [
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

it('verify cdah.arrayGet() return', function() {
  const result = cdah.arrayGet(sayings, '1')
  assert.ok(Array.isArray(result))
  assert.strictEqual(result.length, 1)
  assert.strictEqual(typeof result[0], 'object')
  assert.strictEqual(result[0].id, 1)
})

it("execute cdah.arrayGet('1,2,5')", function() {
  assert.deepStrictEqual(cdah.arrayGet(sayings, '1,2,5'), arrayGetExpect)
})

it("execute cdah.arrayGet('id=1,id=2,id=5')", function() {
  assert.deepStrictEqual(
    cdah.arrayGet(sayings, 'id=1,id=2,id=5'),
    arrayGetExpect
  )
})

it("execute cdah.arrayGet('id=1|2|5')", function() {
  assert.deepStrictEqual(cdah.arrayGet(sayings, 'id=1|2|5'), arrayGetExpect)
})

it("execute cdah.arrayGet('id<3,id>4')", function() {
  assert.deepStrictEqual(cdah.arrayGet(sayings, 'id<3,id>4'), arrayGetExpect)
})

// ===

const arraySearchExpect = [
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

it('verify cdah.arraySearch() return', function() {
  const result = cdah.arraySearch(sayings, '美')
  assert.ok(Array.isArray(result))
  assert.strictEqual(result.length, 2)
  assert.strictEqual(typeof result[0], 'object')
  assert.strictEqual(result[0].id, 3)
  assert.strictEqual(result[1].id, 4)
})

it("execute cdah.arraySearch('美')", function() {
  assert.deepStrictEqual(cdah.arraySearch(sayings, '美'), arraySearchExpect)
})

it("execute cdah.arraySearch('country=美')", function() {
  assert.deepStrictEqual(
    cdah.arraySearch(sayings, 'country=美'),
    arraySearchExpect
  )
})

it("execute cdah.arraySearch('country=*')", function() {
  assert.deepStrictEqual(
    cdah.arraySearch(sayings, 'country=*'),
    arraySearchExpect
  )
})

// ====

const arraySetExpect = [
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

it('execute cdah.arraySet()', function() {
  const queryData = cdah.arraySearch(sayings, 'id=2|5')
  const copyData = JSON.parse(JSON.stringify(queryData))
  const modifyData = cdah.arraySet(copyData, { country: '[美]' })
  assert.deepStrictEqual(modifyData, arraySetExpect)
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
  const path = cdah.arraySearch(sayings, '希伍德').$path
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

it('execute cdah.arrayGet(null)', function() {
  assert.deepStrictEqual(cdah.arrayGet(testData, null), [
    { name: null, sn: 't01' },
    { name: undefined, sn: 't02' },
    { name: '', sn: 't07' },
  ])
})

it('execute cdah.arrayGet([{ value: null, strict: true }])', function() {
  assert.deepStrictEqual(
    cdah.arrayGet(testData, [{ value: null, strict: true }]),
    [{ name: null, sn: 't01' }]
  )
})

it("execute cdah.arrayGet([{ value: '1', enable: true }])", function() {
  assert.deepStrictEqual(
    cdah.arrayGet(testData,
      [{ value: 1, strict: true, enable: true }, { value: true }]),
      [{ name: 1, sn: 't03' },{ name: true, sn: 't05' }]
  )
})

it("execute cdah.arrayGet([{ value: '1', enable: false }])", function() {
  assert.deepStrictEqual(
    cdah.arrayGet(testData,
      [{ value: 1, strict: true, enable: false }, { value: true }]),
      [{ name: true, sn: 't05' }]
  )
})
