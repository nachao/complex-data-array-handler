import Mock from 'mockjs'
import Cdah from '../index'

const { mock } = Mock.mock({
    'mock|100000': [{
        'id|+1': 1,
        text: '@title',
        name: {
            en: '@name',
            zh: '@cname'
        }
    }]
})

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

console.time()
console.log(arrayGet(mock, '1,5000,9999'))
console.timeEnd()


console.time()
console.log(arrayGet(names, '1,2,5'))
console.timeEnd()
