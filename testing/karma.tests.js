let context;

/**
 * Setup testing context for browser tests
 */

// Client
context = require.context('../packages/client/__tests__', true, /\.spec\.js$/);
context.keys().forEach(context);
