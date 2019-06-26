import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel';

export default {
    input: './src/index.js',
    output: {
        file: './dist/index.js',
        name: 'index.js',
        format: 'iife'
    },
    plugins: [
        uglify(),
        babel()
    ]
}
