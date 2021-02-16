import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import App from './App';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateCommunity from './pages/CreateCommunity';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Profile from './pages/Profile';

import PrivateRoute from './components/PrivateRoute';

export default function Routes() {
  const isAuth = () => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      try {
        decode(localStorage.getItem('accessToken'));
        const { exp } = decode(localStorage.getItem('refreshToken'));
        if (Date.now / 1000 > exp) {
          return false;
        }
      } catch (e) {
        return false;
      }

      return true;
    }

    return false;
  };

  return (
    <App isAuth={isAuth()}>
      <Switch>
        {isAuth() && <Redirect from="/(register|login)" to="/" />}
        <Route exact path="/" render={(props) => <Home isAuth={isAuth()} {...props} />} />
        <Route
          exact
          path="/r/:name/submit"
          render={(props) => <CreatePost isAuth={isAuth()} {...props} />}
        />
        <Route
          exact
          path="/r/:name/:id"
          render={(props) => <Post isAuth={isAuth()} {...props} />}
        />
        <Route
          exact
          path="/r/:name"
          render={(props) => <Community isAuth={isAuth()} {...props} />}
        />

        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/user/:userName" isAuth={isAuth()} component={Profile} />
        <PrivateRoute exact path="/create-com" isAuth={isAuth()} component={CreateCommunity} />
      </Switch>
    </App>
  );
}
