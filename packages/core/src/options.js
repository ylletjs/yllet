export default {
  // Basic auth.
  auth: {
    username: '',
    password: ''
  },

  // HTTP headers.
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'    
  },

  // HTTP transport layer
  transport: null,  

  // Optional settings passed to transport layer
  transportConfig: {},  

  // WordPress API endpoint.
  endpoint: '',

  // Default namespace.
  namespace: 'wp/v2'
};
