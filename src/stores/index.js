import { createContext, useContext } from 'react';
import CalendarStore from './calendar';
import PageStore from './page';

class RootStore {
  	constructor() {
    	this.calendar = new CalendarStore(this);
	    this.page = new PageStore(this);
  	}
}

const StoreContext = createContext(new RootStore());

export const useStore = () => useContext(StoreContext);
