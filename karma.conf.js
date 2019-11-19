const webpack = require('webpack');
const path = require('path');

const webpackConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('test')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: {
    fs: 'empty' // Some tests import fs
  },
  resolve: {
    alias: {
      '@yllet/client': path.resolve(__dirname, 'node_modules/@yllet/client/lib/umd')
    }
  }
};

module.exports = config => {
  config.set({
    basePath: '',
    files: [{ pattern: '__browser__/index.js', watched: false }],
    frameworks: ['mocha'],
    reporters: ['dots'],
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-browserstack-launcher'
    ],
    preprocessors: {
      '__browser__/index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true // webpack-dev-middleware configuration
    },
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    colors: true,
    logLevel: config.LOG_DEBUG,
    browserStack: {
      username: 'andrew2460',
      accessKey: 'VMfuPzDqR6ko92bVC6jZ'
    },
    customLaunchers: {
      bs_it_win: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'IE',
        browser_version: '11.0'
      }
    },
    browsers: ['bs_it_win'],
    singleRun: true,
    autoWatch: false,
    client: {
      mocha: {
        opts: './mocha.opts' //
      }
    }
  });
};
