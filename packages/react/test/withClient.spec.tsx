import React from 'react';
import Client from '@yllet/client'
import { render } from '@testing-library/react';
import { Provider, withClient } from '../src';

const Foo = ({ client }:any) => <span>{client.options.endpoint}</span>;

test('withClient', async () => {
  const endpoint = 'http://wordpress.test/wp-json';
  const client = new Client({ endpoint });
  const Connected = withClient(Foo);
  const wrapper = render(
    <Provider client={client}>
      <Connected />
    </Provider>
  );
  expect(wrapper.getByText(endpoint)).not.toBeUndefined();
});
