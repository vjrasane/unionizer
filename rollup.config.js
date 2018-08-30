import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  external: ['path', 'fs'],
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  plugins: [
    resolve(
      // preferBuiltins: false
    ),
    production &&
      babel({
        babelrc: false,
        presets: [['env', { modules: false }]],
        plugins: [
          'external-helpers',
          'transform-class-properties',
          'transform-object-rest-spread'
        ]
      }),
    commonjs(),
    production && uglify()
  ]
};
