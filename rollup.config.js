import path from 'path';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'source/main.js',
    format: 'cjs',
    plugins: [
        babel()
    ],
    dest: 'main.js'
}
