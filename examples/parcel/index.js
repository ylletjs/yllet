import Client from '@yllet/client';

const list = document.getElementById('posts');

const client = new Client({
  endpoint: 'https://cors-anywhere.herokuapp.com/https://wptavern.com/wp-json/',
  headers: {
    'X-Requested-With': 'Yllet'
  }
});

client
  .posts()
  .get()
  .then((res) => {
    res.forEach((p) => {
      list.innerHTML += '<li>' + p.title.rendered + '</li>';
    });
  });
