import resolve from 'rollup-plugin-node-resolve';
import visualizer from 'rollup-plugin-visualizer';
import progress from 'rollup-plugin-progress';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import { createIdentNameGetter } from './IdentName';
import compact from 'lodash/compact';

const createTerser = () => terser({
  toplevel: true,
  mangle: {
    toplevel: true,
    eval: true,
    properties: {
      reserved: ['class', 'renderer']
    }
  },
  compress: {
    toplevel: true,
    hoist_vars: true,
    hoist_props: true,
    passes: 5,
    arguments: true,
    booleans_as_integers: true,
    drop_console: false,
    ecma: 6
  },
  ecma: 7,
  keep_classnames: false,
  keep_fnames: false,
  ie8: false,
  module: false,
  safari10: false,
  warnings: false
});

module.exports = {
  input: 'index.js',
  output: {
    name: 'bundle',
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: compact([
    json(),
    resolve({ extensions: ['.js'] }),
    postcss({
      extract: true,
      modules: {
        generateScopedName: createIdentNameGetter()
      },
      minimize: true,
      extensions: ['.css', '.scss']
    }),
    replace({
      IS_CLIENT: 'true'
    }),
    babel({
      babelrc: false,
      plugins: ['@babel/plugin-proposal-class-properties']
    }),
    progress(),
    process.env.ANALYZE && visualizer({
      filename: './dist/build.info.html',
      sourcemap: true,
      open: process.env.ANALYZE === 'open'
    }),
    process.env.MINIFY && createTerser()
  ])
};
