import React from 'react';
import { mount } from 'enzyme';
import { Provider, withClient, withClientData } from '../';

const Foo = ({ client }) => (
  <span>Foo</span>
);

test('has client prop', () => {
  const client = { test: true };
  const Connected = withClient(Foo);
  const wrapper = mount(
    <Provider client={client}>
      <Connected />
    </Provider>
  );

  expect(wrapper.find('Foo').prop('client')).toBe(client);
  expect(wrapper.contains(<span>Foo</span>)).toBe(true);
});

test('withClientData', () => {
  const client = { test: true };
  const Connected = withClientData(client => {
    return {
      then: (fn) => {
        fn(true);

        return {
          catch: () => {}
        };
      }
    };
  })(Foo);

  const wrapper = mount(
    <Provider client={client}>
      <Connected />
    </Provider>
  );

  expect(wrapper.find('Foo').prop('client')).toBe(client);
  expect(wrapper.find('Foo').prop('data')).toBe(true);
  expect(wrapper.contains(<span>Foo</span>)).toBe(true);
});
