import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';
import { getFirstDay, dayParser } from '../utils/dateCalculator';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class CalendarStore {
	@observable data = [];
	@observable updatedData = [];
	@observable addedData = [];
	@observable deletedData = [];
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
	getCalendarApi = ref => this.calendarApi = ref;

	@action
	setCurDate = () => {
		this.curDateObj.year = this.currentDate.getFullYear();
		this.curDateObj.month = this.currentDate.getMonth()+1;
		this.curDateObj.date = this.currentDate.getDate();
	}

	@action
	currentDateChange = date => {
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
	updateData = (tar, e, mode) => {
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
		if(mode === 'patch')
			this.updatedData.push(tar);
		else if(mode === 'post')
			this.addedData.push(tar);
	}

	@action
	eventChange = changeInfo => {
		const newEvent = changeInfo.event;
		const oldEvent = changeInfo.oldEvent;
		const storedEvent = this.data.find(e => e.id === Number(changeInfo.event.id));
	    if(storedEvent)
			this.updateData(storedEvent, newEvent, 'patch');
    	
		else {
			const start = newEvent.start;
			const end = newEvent.end;
			const cur = this.setTimeSlot[oldEvent.groupId];
			if(cur) {
				cur.startTime = `${('0'+start.getHours()).slice(-2)}:${('0'+start.getMinutes()).slice(-2)}`;
				cur.endTime = `${('0'+end.getHours()).slice(-2)}:${('0'+end.getMinutes()).slice(-2)}`;
				const registeredEvent = this.addedData.find(e => e.groupId === Number(changeInfo.event.groupId));
				if(registeredEvent) {
					this.addedData = this.addedData.filter(d => d !== registeredEvent);
					this.updateData(registeredEvent, newEvent, 'post');
					console.log(this.addedData);
				}
			}
		}
		this.disableSubmitButton = false;
	}

	@action
	eventReceive = event => {
		const color = {
			'악의꽃': '#79A3F4',
			'막무간애': '#FF6B76',
			'모여락': '#CD9CF4' 
		}
		const date = event.start;
		let jsonData = {
			title: event.title,
			start: event.start,
			end: event.end,
			color: color[event.title],
			club: event.title,
			creator: this.root.page.username,
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
		if(this.updatedData.length > 0)
			this.updatedData.map((data) => axios.patch(`api/${data.id}/`, data));
		if(this.addedData.length > 0) {
			console.log(this.addedData);
			if(this.root.page.setCalendarMode) {
				this.root.page.disableSetCalendarMode();
			}
			this.addedData.map(data => axios.post(`api/`, data));
		}
		if(this.deletedData.length > 0) {
			const result = window.confirm("일정을 삭제합니다. 계속하겠습니까?\n(월별 시간 설정의 경우 기존에 설정한 일정을 삭제합니다)");
			if(result)
				this.deletedData.map(data => axios.delete(`api/${data.id}/`, data));
		}
		
		this.updatedData = [];
		this.addedData = [];
		this.deletedData = [];
		setTimeout(() => this.getData(true), 1000);
	}

	@action
	enableSetCalendarMode = () => {
		this.currentDateChange(getFirstDay(1, this.currentDate));
		const year = this.currentDate.getFullYear();
		const month = this.currentDate.getMonth();
		const from = new Date(year, month, 2).toISOString().substring(0, 10);
		const to = new Date(year, month, 9).toISOString().substring(0, 10);
		this.deletedData = this.data.filter(d => d.creator === 'admin')
			.filter(d => from <= d.start)
			.filter(d => d.start <= to);
		console.log(this.deletedData);
		this.data = [];
		this.setTimeSlot.push({
			isFirst: true,
			isLast: true,
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
		const clubDays = [
			{club: '악의꽃', color: '#79A3F4', days: lfdmDays},
			{club: '막무간애', color: '#FF6B76', days: mmgeDays},
			{club: '모여락', color: '#CD9CF4', days: myrDays}
		];

		if(!startTime || !endTime)
			return;

		const tar = this.calendarApi.getEvents().filter(e => e.groupId === String(this.setTimeIdx));
		for(let t of tar)
			t.remove();
		this.addedData = this.addedData.filter(e => e.groupId !== this.setTimeIdx);

		let time = this.currentDate;
		const filteredClubs = clubDays.filter(c => c.days.length > 0);
		for(let c of filteredClubs) {
			let days = [];
			c.days.map(d => days.push(dayParser[d]));
			time = getFirstDay(days[0], this.currentDate);
			const event = {
				startTime: startTime,
				endTime: endTime,
				startRecur: new Date(time.getFullYear(), time.getMonth(), 1),
				endRecur: new Date(time.getFullYear(), time.getMonth()+1, 1),
				groupId: this.setTimeIdx,
				creator: this.root.page.username,
			
				title: c.club,
				club: c.club,
				start: time,
				end: time,
				daysOfWeek: days,
				color: c.color
			}
			this.calendarApi.addEvent(event);
			this.addedData.push(event);
		}
		this.disableSubmitButton = this.calendarApi.getEvents().length === 0;
	}

	@action
	nextTimeSlot = () => {
		const cur = this.setTimeSlot[this.setTimeIdx]
		if(cur.isLast) {
			cur.isLast = false;
			this.setTimeSlot.push({
				isFirst: false,
				isLast: true,
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
