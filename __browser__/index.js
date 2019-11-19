const integrationContext = require.context('./integration', true, /\.spec\.js$/);

integrationContext.keys().forEach(integrationContext);
