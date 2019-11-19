const rollup = require('./rollup.config');

const plugins = rollup.esm({}).plugins;

module.exports = config => {
  config.set({
    basePath: '',
    files: ['__browser__/**/*.{js,spec.js}'],
    preprocessors: {
      '__browser__/**/*.{js,spec.js}': ['rollup']
    },
    rollupPreprocessor: {
      /**
       * This is just a normal Rollup config object,
       * except that `input` is handled for you.
       */
      // plugins: [require('rollup-plugin-buble')()],
      // output: {
      //   format: 'iife', // Helps prevent naming collisions.
      //   name: '<your_project>', // Required for 'iife' format.
      //   sourcemap: 'inline', // Sensible for testing.
      // },
      output: { name: 'Yllet', format: 'umd', sourcemap: 'inline' },
      // external: [...Object.keys(pkg.peerDependencies || {})],
      plugins
    },
    frameworks: ['mocha'],
    plugins: ['karma-mocha', 'karma-browserstack-launcher', 'karma-rollup-preprocessor'],
    reporters: ['dots', 'progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browserStack: {
      username: 'andrew2460',
      accessKey: 'VMfuPzDqR6ko92bVC6jZ'
    },
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      }
    },
    browsers: ['bs_firefox_mac'],
    singleRun: true,
    autoWatch: false
  });
};
