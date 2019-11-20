const webpackConfig = require('./webpack.config.js');
const customLaunchers = require('./karma.browsers.js');

const build = process.env.BABEL_ENV ? process.env.BABEL_ENV : 'cjs';

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    reporters: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-browserstack-launcher'
    ],
    files: [{ pattern: 'karma.tests.js', watched: false }],
    preprocessors: {
      'karma.tests.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig(build),
    webpackMiddleware: {
      noInfo: true // webpack-dev-middleware configuration
    },
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    colors: true,
    logLevel: config.LOG_INFO,
    browserStack: {
      username: 'andrewmclagan3',
      accessKey: 'QQwStTbLhzYxHy8zPjiF'
    },
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    autoWatch: false
  });
};
