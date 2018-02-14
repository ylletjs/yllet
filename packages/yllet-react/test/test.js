import 'jsdom-global/register';
import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider, withClient, withClientData } from '../src';

configure({ adapter: new Adapter() });

const Foo = ({ client }) => (
  <span>Foo</span>
);

test('has client prop', t => {
  const client = { test: true };
  const Connected = withClient(Foo);
  const wrapper = mount(
    <Provider client={client}>
      <Connected />
    </Provider>
  );

  t.is(client, wrapper.find('Foo').prop('client'));
  t.is(true, wrapper.contains(<span>Foo</span>));
});

test('withClientData', t => {
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

  t.is(client, wrapper.find('Foo').prop('client'));
  t.is(true, wrapper.find('Foo').prop('data'));
  t.is(true, wrapper.contains(<span>Foo</span>));
});
