import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import prettier from 'rollup-plugin-prettier';

const plugins = [
  nodeResolve(),
  babel({
    exclude: /node_modules/,
    rootMode: 'upward',
  }),
  prettier(),
];

export default {
  // CommonJS
  cjs: pkg => ({
    input: 'src/index.js',
    output: { file: 'lib/cjs/index.js', format: 'cjs', indent: false },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins,
  }),

  // ES
  es: pkg => ({
    input: 'src/index.js',
    output: { file: 'lib/es/index.js', format: 'es', indent: false },
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins,
  }),
};
