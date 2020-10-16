import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';


export default class CalendarStore {
	@observable data = [];
	@observable currentDate = new Date();
	
	constructor() {
		makeObservable(this);
	}

	getData = flow(function*() {
		const URL = 'http://34.71.74.93:8080/api';
    	const res = yield axios.get(URL);
    	this.data = res.data;
    })

	@action
	currentDateChange = (date) => {
		this.currentDate = date;
	}
}
