import Client from '@yllet/client';

const list = document.getElementById('posts');

const client = new Client({
  endpoint: 'http://wordpress.test/wp-json/'
});

client
  .posts()
  .get()
  .then((res) => {
    res.forEach((p) => {
      list.innerHTML += '<li>' + p.title.rendered + '</li>';
    });
  });
