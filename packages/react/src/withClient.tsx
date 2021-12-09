import React, { useContext } from 'react';
import { Context } from './provider';

const withClient =
  (Component: React.ComponentType) =>
  ({ ...props }) => {
    const context = useContext(Context);
    props.client = context.client;
    return <Component {...props} />;
  };

export default withClient;
