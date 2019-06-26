import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel';

export default {
    input: './src/index.js',
    output: {
        file: './index.js',
        format: 'iife'
    },
    plugins: [
        uglify(),
        babel()
    ]
}
