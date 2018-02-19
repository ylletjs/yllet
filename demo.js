import Client from './packages/yllet/src/index';

const client = new Client({
  endpoint: 'https://demo.wp-api.org/wp-json/'
});

client.config({
  params: {
    hej: 'du'
  }
})

client.posts().get({
  slug: 'hello-world'
}).then(res => {
  console.log(res.config);
  console.log(res.data.length)
}).catch(err => {
  console.log('Error: ' + err.message);
});
