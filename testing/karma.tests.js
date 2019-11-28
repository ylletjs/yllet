import 'isomorphic-fetch';

let context;

/**
 * Setup testing context for browser tests
 *
 * - We do not test react as its DOM API is already heavily tested.
 * - Integration tests entire functionality within a browser on a live API
 */

// Client
context = require.context('../packages/client/__tests__', true, /\.spec\.js$/);
context.keys().forEach(context);

// // Transport Axios
// context = require.context('../packages/transport-axios/__tests__', true, /\.spec\.js$/);
// context.keys().forEach(context);

// // Transport Fetch
// context = require.context('../packages/transport-fetch/__tests__', true, /\.spec\.js$/);
// context.keys().forEach(context);

// Integration
// context = require.context('./integration/__tests__', true, /\.spec\.js$/);
// context.keys().forEach(context);
