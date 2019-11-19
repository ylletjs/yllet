const context = require.context('./integration', true, /\.spec\.js$/);

context.keys().forEach(context);
