const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');

const plugins = [
  resolve(),
  babel({
    exclude: /node_modules/,
    rootMode: 'upward',
    runtimeHelpers: true
  }),
  commonjs(),
  json()
];

module.exports = pkg => ({
  input: 'src/index.js',
  output: { name: 'Yllet', file: 'lib/umd/index.js', format: 'umd', sourcemap: true },
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins
});
