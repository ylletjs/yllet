import 'isomorphic-fetch';

let context;

/**
 * Setup testing context for browser tests
 */

// Client
context = require.context('../packages/client/__tests__', false, /\.spec\.js$/);

// Support
context = require.context(
  '../packages/support/__tests__',
  false,
  /\.spec\.js$/
);

context.keys().forEach(context);
