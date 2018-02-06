import React from 'react';
import PropTypes from 'prop-types';

const withClient = (Component) => {
  return class withClient extends React.Component {
    /**
     * withClient context types.
     *
     * @var {object}
     */
    static contextTypes = {
      client: PropTypes.object.isRequired
    };

    /**
     * Render component with client.
     *
     * @return {object}
     */
    render () {
      const { client } = this.context;
      return <Component {...this.props} client={client} {...this.context} />;
    }
  };
};

export default withClient;
