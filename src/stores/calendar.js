import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';


export default class CalendarStore {
	@observable data = [];
	@observable updatedData = [];
	@observable calendarApi = null;
	@observable currentDate = new Date();
	@observable disableSubmitButton = true;
	
	constructor() {
		makeObservable(this);
	}

	getData = flow(function*() {
		const URL = 'http://34.71.74.93:8080/api';
    	const res = yield axios.get(URL);
    	this.data = res.data;
    })

	@action
	getCalendarApi = (ref) => {
		this.calendarApi = ref;
	}

	@action
	currentDateChange = (date) => {
		this.currentDate = date;
	}

	@action
	eventChange = (changeInfo) => {
		const newEvent = changeInfo.event;
		const storedEvent = this.data.find((e) => e.id == changeInfo.event.id);
	    if (storedEvent) {
			console.log("it worked");
      		storedEvent.title = newEvent.title;
		    storedEvent.allDay = newEvent.allDay;
      		storedEvent.start = newEvent.start || storedEvent.start;
		    storedEvent.end = newEvent.end || storedEvent.end;
    	}
		this.updatedData.push(storedEvent);
		this.disableSubmitButton = false;
	}

	@action
	submitData = () => {
		this.disableSubmitButton = true;
		this.updatedData.map((data) => axios.put(`api/${data.id}/`, data));
		this.updatedData = [];
	}
}
