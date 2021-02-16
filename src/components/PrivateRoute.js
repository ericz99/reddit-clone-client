import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ component: Component, isAuth, ...props }) {
  return (
    <Route
      {...props}
      render={(props) =>
        isAuth ? <Component {...props} isAuth={isAuth} /> : <Redirect to="/login" />
      }
    />
  );
}
