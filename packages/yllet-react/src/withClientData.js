import React from 'react';
import PropTypes from 'prop-types';

const withClientData = (fn) => {
  return (Component) => {
    return class withClientData extends React.Component {
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
        fn(this.context.client).then(res => {
          this.setState({
            data: res.data
          });
        }).catch(err => {
          this.setState({
            error: err
          });
        })
      }

      /**
       * Render component with client and api data.
       *
       * @return {object}
       */
      render () {
        return <Component {...this.props} {...this.context} {...this.state} />;
      }
    };
  };
};

export default withClientData;
