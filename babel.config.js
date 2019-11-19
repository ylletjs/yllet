module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: ['esm', 'umd'].includes(process.env.BABEL_ENV) ? false : 'cjs'
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining'
  ]
};
