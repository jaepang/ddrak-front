import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';
import { getFirstDay, dayParser } from '../utils/dateCalculator';

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
	@observable setTimeSlot = [];
	@observable setTimeIdx = 0;

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
		const date = event.start;
		let jsonData = {
			title: event.title,
			start: event.start,
			end: event.end,
			color: event.color,
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
		this.currentDateChange(getFirstDay(1, this.currentDate));
		this.data = [];
		this.setTimeSlot.push({
			isFirst: true,
			isLast: true,
			displayed: false,
			startTime: null,
			endTime: null,
			lfdmDays: [],
			mmgeDays: [],
			myrDays: []
		});
	}
	@action
	disableSetCalendarMode = () => {
		this.currentDateChange(new Date());
		this.calendarApi.getEvents().map(e => e.remove());
		this.disableSubmitButton = true;
		this.setTimeSlot = [];
		this.setTimeIdx = 0;
		this.getData();
	}

	@action
	displayTimeSlot = (type, info) => {
		const cur = this.setTimeSlot[this.setTimeIdx];
		const { startTime, endTime, lfdmDays, mmgeDays, myrDays } = cur;
		if(!startTime || !endTime 
		|| (lfdmDays.length===0 && mmgeDays.length===0 && myrDays.length===0))
			return;
		if(cur.displayed) {
			const tar = this.calendarApi.getEvents().filter(e => 
				`${('0'+e[type].getHours()).slice(-2)}:00` === info
			);
			tar.map(t => t.remove());
		}
		else
			cur.displayed = true;

		let time = this.currentDate;
		const eventTemplate = {
			startTime: startTime,
			endTime: endTime,
			startRecur: new Date(time.getFullYear(), time.getMonth(), 1),
			endRecur: new Date(time.getFullYear(), time.getMonth()+1, 1),
		}

		let days = [];
		if(lfdmDays.length > 0) {
			lfdmDays.map(d => days.push(dayParser[d]));
			let time = getFirstDay(days[0], this.currentDate);
			const lfdmEvent = {
				...eventTemplate,
				title: '악의꽃',
				start: time,
				end: time,
				daysOfWeek: days,
				groupId: startTime,
				color: '#79A3F4'
			}
			this.calendarApi.addEvent(lfdmEvent);
		}
		if(mmgeDays.length > 0) {
			days = [];
			mmgeDays.map(d => days.push(dayParser[d]));
			time = getFirstDay(days[0], this.currentDate);
			console.log(days);
			const mmgeEvent = {
				...eventTemplate,
				title: '막무간애',
				start: time,
				end: time,
				daysOfWeek: days,
				groupId: startTime,
				color: '#FF6B76'
			}
			this.calendarApi.addEvent(mmgeEvent);
		}
		if(myrDays.length > 0) {
			days = [];
			myrDays.map(d => days.push(dayParser[d]));
			time = getFirstDay(days[0], this.currentDate);
			const myrEvent = {
				...eventTemplate,
				title: '모여락',
				start: time,
				end: time,
				daysOfWeek: days,
				groupId: startTime,
				color: '#CD9CF4'
			}
			days = [];
			this.calendarApi.addEvent(myrEvent);
		}
	}
	@action
	nextTimeSlot = () => {
		const cur = this.setTimeSlot[this.setTimeIdx]
		if(cur.isLast) {
			cur.isLast = false;
			this.setTimeSlot.push({
				isFirst: false,
				isLast: true,
				displayed: false,
				startTime: null,
				endTime: null,
				lfdmDays: [],
				mmgeDays: [],
				myrDays: []
			});
		}
		this.setTimeIdx++;
	}
	@action
	prevTimeSlot = () => this.setTimeIdx--;
	@action
	changeStartTimeSlot = time =>  { 
		const prev = this.setTimeSlot[this.setTimeIdx].startTime;
		this.setTimeSlot[this.setTimeIdx].startTime = time;
		this.displayTimeSlot('start', prev);
	}
	@action
	changeEndTimeSlot = time => { 
		const prev = this.setTimeSlot[this.setTimeIdx].endTime;
		this.setTimeSlot[this.setTimeIdx].endTime = time;
		this.displayTimeSlot('end', prev);
	}
	@action
	changeDays = (id, days) =>  {
		const startInfo = this.setTimeSlot[this.setTimeIdx].startTime;
		this.setTimeSlot[this.setTimeIdx][id] = days;
		this.displayTimeSlot('start', startInfo);
	}
}
