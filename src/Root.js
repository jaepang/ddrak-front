import React from 'react';
import App from './components/App';
import CalendarStore from './stores/calendar';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

const calendar = new CalendarStore();

const Root = () => {
  return(
	  <Provider calendar={calendar}>
	  	<BrowserRouter>
		  <App />
	  	</BrowserRouter>
	  </Provider>
  );
};

export default Root;
