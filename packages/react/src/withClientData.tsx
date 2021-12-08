import React from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import Client from '@yllet/client';

type WithClientDataFunction = (client: Client, props: any) => Promise<any>;

const withClientData =
  (fn: WithClientDataFunction) => (Component: React.ComponentType) =>
    class withClientData extends React.Component {
      /**
       * Default state.
       *
       * @var {object}
       */
      state = {
        data: {},
        error: null,
        loading: true
      };

      /**
       * withClient context types.
       *
       * @var {object}
       */
      static contextTypes = {
        client: PropTypes.object.isRequired
      };

      /**
       * Fetch data on mount.
       */
      componentDidMount() {
        return fn(this.context.client, this.props)
          .then((data) => {
            this.setState({ data, loading: false });
          })
          .catch((error) => {
            this.setState({ error, loading: false });
          });
      }

      /**
       * Render component with client and api data.
       *
       * @return {object}
       */
      render() {
        return <Component {...this.props} {...this.context} {...this.state} />;
      }
    };

export default withClientData;
