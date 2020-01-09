import { expectType } from 'tsd';
import Client from '.';

const client = new Client();

expectType<Client>(client.resource('posts'));

/*
const requestMethods = {
  get: 'get',
  create: 'post',
  update: 'patch',
  delete: 'delete'
} as const;

const resources = [
  'categories',
  'comments',
  'media',
  'statuses',
  'pages',
  'posts',
  'settings',
  'tags',
  'taxonomies',
  'types',
  'users',
  'search'
] as const;

for (const method in requestMethods) {
  expectType<Promise<unknown>>(requestMethods[method]());
}

for (const resource of resources) {
  expectType<Client>(client[resource]());
}
*/
