import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    name: 'scopedStyle',
    file: 'scoped-style.js',
    dir: 'dist/',
    sourcemap: true,
  },
  plugins: [uglify()],
};
