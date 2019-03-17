import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

function prepack(options = {}) {
  return {
    name: 'prepack (custom)',
    renderChunk(fileContents, { fileName, map }) {
      const { code } = prepackSources([
        {
          filePath: fileName,
          fileContents,
          sourceMapContents: map
        }
      ], options);

      return code;
    }
  };
}

module.exports = {
  input: 'index.js',
  output: {
    name: 'bundle',
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve({ extensions: ['.js'] }),
    postcss({
      extract: false,
      modules: true,
      minimize: true,
      extensions: ['.css', '.scss']
    }),
    babel({
      babelrc: false,
      plugins: ['@babel/plugin-proposal-class-properties']
    }),
    terser({
      toplevel: true,
      mangle: {
        toplevel: true,
        eval: true
      },
      compress: {
        passes: 2,
        arguments: true,
        booleans_as_integers: true,
        ecma: 6,
        unsafe: true
      },
      ecma: 7,
      keep_classnames: false,
      keep_fnames: false,
      ie8: false,
      module: false,
      safari10: false,
      warnings: false
    })
  ]
};
