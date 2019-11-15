import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

export default [
  // CommonJS
  {
    input: 'src/index.js',
    output: { file: 'lib/cjs/index.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      nodeResolve(),
      babel({
        exclude: /node_modules/,
        rootMode: "upward"        
      })
    ]
  },

  // ES
  {
    input: 'src/index.js',
    output: { file: 'lib/es/index.js', format: 'es', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      nodeResolve(),
      babel({
        exclude: /node_modules/,
        rootMode: "upward"        
      })
    ]
  },
]