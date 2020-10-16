import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Events from './stores/events';
import CalendarData from './stores/calendar.js'

const events = new Events();
const calData = new CalendarData();

ReactDOM.render(
  <Provider events={events} calData={calData}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
