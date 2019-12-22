/**
 * Setup testing context for browser tests
 */

// Client
const context = require.context(
  '../packages/client/__tests__',
  false,
  /\.spec\.js$/
);

context.keys().forEach(context);
