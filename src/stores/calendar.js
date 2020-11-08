import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';
import { getFirstMon } from '../utils/dateCalculator';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class CalendarStore {
	@observable data = [];
	@observable updatedData = [];
	@observable dataSubmitType = '';
	@observable calendarApi = null;
	@observable currentDate = new Date();
	@observable curDateObj = {
		year: this.currentDate.getFullYear(),
		month: this.currentDate.getMonth()+1,
		date: this.currentDate.getDate(),
	};
	@observable disableSubmitButton = true;

	constructor(root) { 
		makeObservable(this);
		this.root = root; 
	}

	getData = flow(function*(flag) {
		const cur = this.currentDate
		const from = new Date(cur.getFullYear(), cur.getMonth()-1, 1).toISOString();
		const to = new Date(cur.getFullYear(), cur.getMonth()+2, 0).toISOString();
    	const res = yield axios.get(`/api/?start__gte=${from}&start__lt=${to}`);
    	this.data = res.data;
		if(flag) {
			alert('data updated!');
		}
	})

	@action
	getCalendarApi = (ref) => this.calendarApi = ref;

	@action
	setCurDate = () => {
		this.curDateObj.year = this.currentDate.getFullYear();
		this.curDateObj.month = this.currentDate.getMonth()+1;
		this.curDateObj.date = this.currentDate.getDate();
	}

	@action
	currentDateChange = (date) => {
		const y = this.currentDate.getFullYear();
		const m = this.currentDate.getMonth();
		this.currentDate = date;
		this.calendarApi.gotoDate(date);
		this.updateMonthData(y, m, date);
		this.setCurDate();
	}
	
	moveToday = () => this.currentDateChange(new Date());
	@action
	moveRight = () => {
		const y = this.currentDate.getFullYear();
		const m = this.currentDate.getMonth();
		const d = this.currentDate.getDate();
		this.currentDate.setDate(d+7);
		this.calendarApi.next();
		this.updateMonthData(y, m, this.currentDate);
		this.setCurDate();
	}
	@action
	moveLeft = () => {
		const y = this.currentDate.getFullYear();
		const m = this.currentDate.getMonth();
		const d = this.currentDate.getDate();
		this.currentDate.setDate(d-7);
		this.calendarApi.prev();
		this.updateMonthData(y, m, this.currentDate);
		this.setCurDate();
	}

	@action
	updateMonthData = (y, m, date) => {
		if(m !== date.getMonth() || y !== date.getFullYear()) {
			this.getData();
		}
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
		console.log(newEvent);
		const storedEvent = this.data.find((e) => e.id === Number(changeInfo.event.id));
	    if (storedEvent) {
			this.dataSubmitType = 'patch';
			this.updateData(storedEvent, newEvent);
    	}
		this.disableSubmitButton = false;
	}

	@action
	eventReceive = event => {
		const date = event.start
		let jsonData = {
			title: event.title,
			start: event.start,
			end: event.end,
			club: event.title,
			creator: 'admin',
			groupId: event.title + date.toISOString(),
			daysOfWeek: [date.getDay()],
			startTime: event.start.getHours() + ':' + event.start.getMinutes(),
			endTime: event.end.getHours() + ':' + event.end.getMinutes(),
			startRecur: new Date(date.getFullYear(), date.getMonth(), 1),
			endRecur: new Date(date.getFullYear(), date.getMonth()+1, 1)
		}
		this.updatedData.push(jsonData);
		this.dataSubmitType = 'post';
		this.disableSubmitButton = false;
	}

	/* TODO
	 * this is only for edit, add, should implement delete
	 * */
	@action
	submitData = () => {
		this.disableSubmitButton = true;
		if(this.dataSubmitType === 'patch')
			this.updatedData.map((data) => axios.patch(`api/${data.id}/`, data));
		else if(this.dataSubmitType === 'post') {
			console.log(this.updatedData);
			this.updatedData.map((data) => axios.post(`api/`, data));
		}
		this.updatedData = [];
		this.dataSubmitType = '';
		setTimeout(() => this.getData(true), 1000);
	}

	@action
	enableSetCalendarMode = () => {
		this.currentDateChange(getFirstMon(this.currentDate));
		this.data = [];
	}
	disableSetCalendarMode = () => {
		this.currentDateChange(new Date());
		this.calendarApi.getEvents().map(e => e.remove());
		this.disableSubmitButton = true;
		this.getData();
	}
}
