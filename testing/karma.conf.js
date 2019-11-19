const webpackConfig = require('webpack.config.js');
const customLaunchers = require('karma.browsers.js');

const build = 'umd';

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
    files: [{ pattern: 'testing/karma.tests.js', watched: false }],
    preprocessors: {
      'testing/karma.tests.js': ['webpack', 'sourcemap']
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
      username: 'andrew2460',
      accessKey: 'VMfuPzDqR6ko92bVC6jZ'
    },
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    autoWatch: false
  });
};
