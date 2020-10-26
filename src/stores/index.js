import CalendarStore from './calendar';
import PageStore from './page';

class RootStore {
  	constructor() {
    	this.calendar = new CalendarStore(this);
	    this.page = new PageStore(this);
  	}
}

export default RootStore;
