import React from 'react';
import PropTypes from 'prop-types';

const withClientData = (fn) => {
  return (Component) => {
    return class withClientData extends React.Component {
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
        fn(this.context.client).then(res => {
          this.setState({
            data: res.data,
            loading: false
          });
        }).catch(err => {
          this.setState({
            error: err,
            loading: false
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
