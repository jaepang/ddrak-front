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
	@observable clubCalendar = false;

	constructor(root) { 
		makeObservable(this);
		this.root = root; 
	}

	getData = flow(function*(flag) {
		const cur = this.currentDate;
		const from = new Date(cur.getFullYear(), cur.getMonth()-1, 1).toISOString();
		const to = new Date(cur.getFullYear(), cur.getMonth()+2, 0).toISOString();
    	const res = yield axios.get(`/api/?start__gte=${from}&start__lt=${to}`);
		if(this.root.page.userclub !== 'none' && this.clubCalendar) {
			const clubData = res.data.filter(d => d.creator === this.root.page.userclub + 'admin');
			this.data = res.data.filter(e => e.creator === 'admin').concat(clubData);
		}
		else
			this.data = res.data.filter(e => e.creator === 'admin');
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
		if(!this.root.page.setCalendarMode)
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
		if(!this.root.page.setCalendarMode)
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
	updateData = (tar, e, data) => {
		const { title, allDay, start, end } = e;
		tar.title = title;
		tar.allDay = allDay;
		tar.start = start || tar.start;
		tar.end = end || tar.end;
		if(tar.groupId) {
			for(let event of this.data.filter(e => e.groupId === tar.groupId)) {
				const startTime = start.getHours() + ':' + start.getMinutes();
				const endTime = end.getHours() + ':' + end.getMinutes();
				event.start = start || event.start;
				event.end = end || event.end;
				event.startTime = startTime;
				event.endTime = endTime;
				data.push(event);
			}
		}
		else
			data.push(tar);
	}

	@action
	eventChange = changeInfo => {
		const newEvent = changeInfo.event;
		const oldEvent = changeInfo.oldEvent;
		const username = this.root.page.username;
		const isFullAdmin = username === 'admin';
		const storedEvent = this.data.find(e => String(e.id) === changeInfo.event.id);
	    if(storedEvent)
			this.updateData(storedEvent, newEvent, this.updatedData);
		else {
			console.log(oldEvent);
			const start = newEvent.start;
			const end = newEvent.end;
			const cur = this.setTimeSlot[oldEvent.groupId] || this.setTimeSlot[Number(oldEvent.id.slice(-1))];
			if(cur) {
				if(isFullAdmin) {
					cur.startTime = `${('0'+start.getHours()).slice(-2)}:${('0'+start.getMinutes()).slice(-2)}`;
					cur.endTime = `${('0'+end.getHours()).slice(-2)}:${('0'+end.getMinutes()).slice(-2)}`;
					for(let event of this.addedData.filter(event => event.id === changeInfo.event.id)) {
						event.startTime = cur.startTime;
						event.endTime = cur.endTime;
					}
				}
				else {
					cur.startTime = start;
					cur.endTime = end;
					console.log(cur);
				}
			}
			else {
				const registeredEvent = this.addedData.find(e => e.id === changeInfo.event.id);
				if(registeredEvent) {
					const idx = this.addedData.indexOf(registeredEvent);
					this.addedData.splice(idx, 1);
					this.updateData(registeredEvent, newEvent, this.addedData);
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
			'모여락': '#CD9CF4',
			'합주': '#79A3F4',
			'합주 테스트': '#FF6B76',
			'공연': '#CD9CF4'
		}
		const date = event.start;
		const username = this.root.page.username;
		const isFullAdmin = username === 'admin';
		let jsonData = {
			id: event.id,
			title: event.title,
			start: event.start,
			end: event.end,
			color: color[event.title],
			club: isFullAdmin ? event.title : this.root.page.userclub,
			creator: username
		}
		if(isFullAdmin) {
			jsonData = {
				...jsonData,
				groupId: event.title + date.toISOString(),
				daysOfWeek: [date.getDay()],
				startTime: event.start.getHours() + ':' + event.start.getMinutes(),
				endTime: event.end.getHours() + ':' + event.end.getMinutes(),
				startRecur: new Date(date.getFullYear(), date.getMonth(), 1),
				endRecur: new Date(date.getFullYear(), date.getMonth()+1, 1)
			}
		}
		this.addedData.push(jsonData);
		this.disableSubmitButton = false;
	}

	@action
	submitData = () => {
		if(this.deletedData.length > 0) {
			const result = window.confirm("일정을 삭제합니다. 계속하겠습니까?\n(월별 시간 설정의 경우 기존에 설정한 일정을 삭제합니다)");
			if(result)
				this.deletedData.map(data => axios.delete(`api/${data.id}/`, data));
			else
				return;
		}
		if(this.updatedData.length > 0)
			this.updatedData.map((data) => axios.patch(`api/${data.id}/`, data));
		if(this.addedData.length > 0) {
			if(this.root.page.setCalendarMode) {
				this.root.page.disableSetCalendarMode();
			}
			this.addedData.map(data => axios.post(`api/`, data));
		}

		this.disableSubmitButton = true;
		this.updatedData = [];
		this.addedData = [];
		this.deletedData = [];
		setTimeout(() => this.getData(true), 1000);
	}

	@action
	enableSetCalendarMode = () => {
		this.setTimeSlot.push({
				isFirst: true,
				isLast: true,
				startTime: null,
				endTime: null
		});
		if(this.root.page.username === 'admin') {
			this.currentDateChange(getFirstDay(1, this.currentDate));
			const year = this.currentDate.getFullYear();
			const month = this.currentDate.getMonth();
			const from = new Date(year, month, 2).toISOString().substring(0, 10);
			const to = new Date(year, month, 9).toISOString().substring(0, 10);
			this.deletedData = this.data.filter(d => d.creator === 'admin')
				.filter(d => from <= d.start)
				.filter(d => d.start <= to);
			this.data = [];
			this.setTimeSlot[0] = {
				...this.setTimeSlot[0],
				lfdmDays: [],
				mmgeDays: [],
				myrDays: []
			};
		} else {
			const clubData = this.data.filter(d => d.club === this.root.page.userclub);
			let data = this.data.filter(d => d.club !== this.root.page.userclub)
				.concat(clubData.filter(d => d.creator !== 'admin'));
			this.data = [];
			for(let idx in data) {
				const own = this.root.page.username === data[idx].creator;
				const newData = {
					...data[idx],
					editable: own,
					color: own ? null:'#777'
				};
				this.data.push(newData);
			}
			
			this.setTimeSlot[0] = {
				...this.setTimeSlot[0],
				title: ''
			};
		}
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
	displayTimeSlot = () => {
		const cur = this.setTimeSlot[this.setTimeIdx];
		const { startTime, endTime, lfdmDays, mmgeDays, myrDays, title } = cur;
		const isFullAdmin = this.root.page.username === 'admin';
		const clubDays = [
			{club: '악의꽃', color: '#79A3F4', days: lfdmDays},
			{club: '막무간애', color: '#FF6B76', days: mmgeDays},
			{club: '모여락', color: '#CD9CF4', days: myrDays}
		];

		if(!startTime || !endTime)
			return;

		let tar;
		if(isFullAdmin) {
			tar = this.calendarApi.getEvents().filter(e => e.groupId === String(this.setTimeIdx));
			this.addedData = this.addedData.filter(e => e.groupId !== this.setTimeIdx);
			for(let t of tar)
				t.remove();
		}
		else {
			tar = this.calendarApi.getEvents().find(e => e.id === this.root.page.userclub + String(this.setTimeIdx));
			this.addedData = this.addedData.filter(e => e.id !== this.root.page.userclub + String(this.setTimeIdx));
			if(tar)
				tar.remove();
		}

		let event;
		if(isFullAdmin) {
			let time = this.currentDate;
			const filteredClubs = clubDays.filter(c => c.days.length > 0);
			for(let c of filteredClubs) {
				let days = [];
				c.days.map(d => days.push(dayParser[d]));
				time = getFirstDay(days[0], this.currentDate);

				event = {
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
		}
		else {
			event = {
				start: startTime,
				end: endTime,
				title: title,
				id: this.root.page.userclub + String(this.setTimeIdx),
				creator: this.root.page.username,
				club: this.root.page.userclub,
				//color: c.color
			}
			this.calendarApi.addEvent(event);
			this.addedData.push(event);
		}
		this.disableSubmitButton = this.calendarApi.getEvents().length === 0;
	}

	@action
	nextTimeSlot = () => {
		const cur = this.setTimeSlot[this.setTimeIdx];
		if(cur.isLast) {
			cur.isLast = false;
			this.setTimeSlot.push({
				isFirst: false,
				isLast: true,
				startTime: null,
				endTime: null,
			});
			const idx = this.setTimeSlot.length - 1;
			if(this.root.page.username === 'admin') {
				this.setTimeSlot[idx] = {
					...this.setTimeSlot[idx],
					lfdmDays: [],
					mmgeDays: [],
					myrDays: []
				};
			}
			else {
				this.setTimeSlot[idx] = {
					...this.setTimeSlot[idx],
					title: ''
				};
			}
		}
		this.setTimeIdx++;
	}

	@action
	prevTimeSlot = () => this.setTimeIdx--;

	@action
	changeStartTimeSlot = time =>  { 
		this.setTimeSlot[this.setTimeIdx].startTime = time;
		this.displayTimeSlot();
	}

	@action
	changeEndTimeSlot = time => { 
		this.setTimeSlot[this.setTimeIdx].endTime = time;
		this.displayTimeSlot();
	}

	@action
	changeDays = (id, days) =>  {
		this.setTimeSlot[this.setTimeIdx][id] = days;
		this.displayTimeSlot();
	}

	@action
	changeTitle = event =>  {
		this.setTimeSlot[this.setTimeIdx].title = event.target.value;
		this.displayTimeSlot();
	}
}
