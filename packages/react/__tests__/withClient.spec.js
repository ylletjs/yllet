import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider, withClient, withClientData } from '../src';

const Foo = ({ client }) => <span>{client.test}</span>;
const FooData = ({ data }) => <span>{data.test}</span>;

test('withClient', async () => {
  const client = { test: 'client' };
  const Connected = withClient(Foo);
  const wrapper = render(
    <Provider client={client}>
      <Connected />
    </Provider>
  );
  expect(wrapper.getByText('client')).not.toBeUndefined();
});

test('withClientData', async () => {
  const client = new Promise((resolve) => resolve({ test: 'client' }));

  const Connected = withClientData((client) => {
    return client;
  })(FooData);

  const wrapper = render(
    <Provider client={client}>
      <Connected />
    </Provider>
  );

  await waitFor(() => expect(wrapper.getByText('client')).not.toBeUndefined());
});
