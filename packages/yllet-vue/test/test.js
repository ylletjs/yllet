import test from 'ava';
import Client from 'yllet';
import YlletPlugin from '../src';

test('test plugin with client', t => {
  function Vue() {}

  const client = new Client;

  YlletPlugin.install(Vue, client);

  t.is(client, Vue.prototype.$yllet);
});

test('test plugin with options', t => {
  function Vue() {}

  YlletPlugin.install(Vue, {});

  t.is(true, typeof Vue.prototype.$yllet === 'object');
});
