let context;

// Client
context = require.context('../packages/client/__tests__', true, /\.spec\.js$/);
context.keys().forEach(context);

// // Transport Axios
// context = require.context('../packages/transport-action/__tests__', true, /\.spec\.js$/);
// context.keys().forEach(context);

// // Transport Fetch
// context = require.context('../packages/transport-fetch/__tests__', true, /\.spec\.js$/);
// context.keys().forEach(context);

// // Integration
// context = require.context('./__tests__', true, /\.spec\.js$/);
// context.keys().forEach(context);
