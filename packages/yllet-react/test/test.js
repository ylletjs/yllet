import test from 'ava';
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider, withClient } from '../src';

configure({ adapter: new Adapter() });

const Foo = ({ client }) => (
  <span>Foo</span>
);

test('has client prop', t => {
  const client = { test: true };
  const With = Foo;
  const wrapper = shallow(<Provider client={client}><With/></Provider>).dive();

  t.is(wrapper.contains(<span>Foo</span>), true);
});
