import React from 'react';
import ReactDOM from 'react-dom';
import indexRoutes from './routes/index.jsx';
import {  Route, Switch, BrowserRouter } from 'react-router-dom';

import './assets/scss/style.css';

import '@progress/kendo-theme-default/dist/all.css';
import './assets/scss/app.css';

ReactDOM.render(
  <BrowserRouter>
  
    <Switch>
      {indexRoutes.map((prop, key) => {
       
          return <Route path={prop.path} key={key} component={prop.component} />;
      })}
    </Switch>
  
  </BrowserRouter>
  ,document.getElementById('root')); 
