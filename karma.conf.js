const webpack = require('webpack');
const path = require('path');

const webpackConfig = {
  mode: 'development',
  // devtool: 'inline-source-map',
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
    files: ['__browser__/index.js'],
    frameworks: ['mocha'],
    reporters: ['dots'],
    plugins: ['karma-mocha', 'karma-webpack', 'karma-browserstack-launcher'],
    preprocessors: {
      '__browser__/index.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true // webpack-dev-middleware configuration
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    browserStack: {
      username: 'andrew2460',
      accessKey: 'VMfuPzDqR6ko92bVC6jZ'
    },
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '43.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      }
    },
    browsers: ['bs_firefox_mac'],
    singleRun: true,
    autoWatch: false,
    client: {
      mocha: {
        opts: './mocha.opts' //
      }
    }
  });
};
