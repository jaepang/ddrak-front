import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class CalendarStore {
	@observable data = [];
	@observable updatedData = [];
	@observable calendarApi = null;
	@observable currentDate = new Date();
	@observable disableSubmitButton = true;

	constructor(root) { 
		makeObservable(this);
		this.root = root; 
	}

	getData = flow(function*(flag) {
    	const res = yield axios.get('/api');
    	this.data = res.data;
		if(flag) {
			alert('data updated!');
		}
    })

	@action
	getCalendarApi = (ref) => this.calendarApi = ref;

	@action
	currentDateChange = (date) => {
		this.currentDate = date;
		this.calendarApi.gotoDate(date);
	}

	@action
	updateData = (tar, e) => {
		const { title, allDay, start, end } = e;
		tar.title = title;
		tar.allDay = allDay;
		tar.start = start || tar.start;
		tar.end = end || tar.end;
		if(tar.groupId) {
			const startTime = start.getHours() + ':' + start.getMinutes();
			const endTime = end.getHours() + ':' + end.getMinutes();
			tar.startTime = startTime || tar.startTime;
			tar.endTime = endTime || tar.endTime;
		}
		this.updatedData.push(tar);
	}

	@action
	eventChange = (changeInfo) => {
		const newEvent = changeInfo.event;
		const storedEvent = this.data.find((e) => e.id === Number(changeInfo.event.id));
	    if (storedEvent) {
			this.updateData(storedEvent, newEvent);
    	}
		this.disableSubmitButton = false;
	}

	/* TODO
	 * this is only for edit, should add, delete
	 * */
	@action
	submitData = () => {
		this.disableSubmitButton = true;
		this.updatedData.map((data) => axios.patch(`api/${data.id}/`, data));
		this.updatedData = [];
		setTimeout(() => this.getData(true), 1000);
	}
}
