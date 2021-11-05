import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const Index = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout {...props.props}>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

Index.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default Index;
