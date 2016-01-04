import React from 'react';
import { Route } from 'react-router';

import App from './containers/app';
import Home from './containers/home';


export default (
  <Route component={App}>
    <Route path="/" component={Home} />
  </Route>
);
