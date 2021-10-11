import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';
import { getFirstDay, dayParser } from '../utils/dateCalculator';
import moment from 'moment';
import 'moment/locale/ko';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
moment.locale('ko');

export default class CalendarStore {
	/* for display */
	@observable data = [];
	@observable clubData = {
		'악의꽃': [],
		'막무간애': [],
		'모여락': []
	};
	/* for submit */
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
		const allClubData = res.data.filter(d => d.creator !== 'admin');
		for(let club in this.clubData) {
			this.clubData[club] = allClubData.filter(d => d.club === club);
		}
		
		if(this.root.page.userclub !== 'none' && this.clubCalendar) {
			this.data = res.data.filter(d => d.club !== this.root.page.userclub)
				.concat(this.clubData[this.root.page.userclub]);
			this.data.forEach(e => {
				if(e.creator === 'admin') {
					e.color = '#777';
					e.editable = false;
				}
			});
		}
		else {
			this.data = res.data.filter(e => e.creator === 'admin');
			if(!this.root.page.isSuper)
				this.data.map(e => e.editable = false);
		}
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
	updateData = (tar, newEvent, oldEvent, data) => {
		const { title, allDay, start, end } = newEvent;
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
		if(oldEvent && !this.root.page.isSuper) {
			let inDay = 6 <= oldEvent.start.getHours() && (6 <= oldEvent.end.getHours() || (oldEvent.end.getHours() === 0 && oldEvent.end.getMinutes() === 0));
			if(!inDay) {
				let start = oldEvent.start.getHours() < 6 ? oldEvent.start:new Date(oldEvent.start.getFullYear(), oldEvent.start.getMonth(), oldEvent.start.getDay(), 0, 0);
				let end = oldEvent.end.getHours() < 6 ? oldEvent.end:new Date(oldEvent.getFullYear(), oldEvent.getMonth(), oldEvent.end.getDay(), 6, 0);
				const event = this.data.find(e => e.start === start && e.end === end);
				if(event) {
					inDay = 6 <= start.getHours() && (6 <= end.getHours() || (end.getHours() === 0 && end.getMinutes() === 0));
					if(!inDay) {
						start = start.getHours() < 6 ? start:new Date(start.getFullYear(), start.getMonth(), start.getDay(), 0, 0);
						end = end.getHours() < 6 ? end:new Date(end.getFullYear(), end.getMonth(), end.getDay(), 6, 0);
						event.start = start;
						event.end = end;
						data.push(event);
					}
					else
						this.deletedData.push(event);
				}
			}
		}
	}

	@action
	eventChange = changeInfo => {
		const newEvent = changeInfo.event;
		const oldEvent = changeInfo.oldEvent;
		const isSuper = this.root.page.isSuper;
		const storedEvent = this.data.find(e => String(e.id) === changeInfo.event.id);
	    
		if(storedEvent)
			this.updateData(storedEvent, newEvent, oldEvent, this.updatedData);
		else {
			const start = newEvent.start;
			const end = newEvent.end;
			if(!isSuper) {
				const inDay = 6 <= start.getHours() && (6 <= end.getHours() || (end.getHours() === 0 && end.getMinutes() === 0));
				if(!inDay)// night
					window.alert('설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다.');
			}
			const cur = this.setTimeSlot[oldEvent.groupId] || this.setTimeSlot[Number(oldEvent.id.slice(-1))];
			if(cur) {
				if(isSuper) {
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
				}
			}
			else {
				const registeredEvent = this.addedData.find(e => e.id === changeInfo.event.id);
				if(registeredEvent) {
					const idx = this.addedData.indexOf(registeredEvent);
					this.addedData.splice(idx, 1);
					this.updateData(registeredEvent, newEvent, null, this.addedData);
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
		const isSuper = this.root.page.isSuper;
		const start = event.start;
		const end = event.end;
		if(!isSuper) {
			const inDay = 6 <= start.getHours() && (6 <= end.getHours() || (end.getHours() === 0 && end.getMinutes() === 0));
			if(!inDay) { // night
				const result = window.confirm('설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다. 계속하시겠습니까?');
				if(!result) {
					event.remove();
					return;
				}
			}
		}
		let jsonData = {
			id: event.id,
			title: event.title,
			start: event.start,
			end: event.end,
			color: color[event.title],
			club: isSuper ? event.title : this.root.page.userclub,
			creator: username
		}
		if(isSuper) {
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
		const isSuper = this.root.page.isSuper;
		if(this.deletedData.length > 0) {
			const result = window.confirm("일정을 삭제합니다. 계속하겠습니까?\n(월별 시간 설정의 경우 기존에 설정한 일정을 삭제합니다)");
			if(result)
				this.deletedData.map(data => axios.delete(`api/${data.id}/`, data));
				/**
				 * TODO: delete night data whose original is deleted
				 */
			else
				return;
		}
		if(this.updatedData.length > 0) {
			this.updatedData.forEach((data) => {
				axios.patch(`api/${data.id}/`, data);
				if(!isSuper) {
					const start = data.start;
					const end = data.end;
					const inDay = 6 <= start.getHours() && (6 <= end.getHours() || (end.getHours() === 0 && end.getMinutes() === 0));
					if(!inDay)
						this.submitNightData(data);
				}
			});
		}
		if(this.addedData.length > 0) {
			if(this.root.page.setCalendarMode) {
				this.root.page.disableSetCalendarMode();
			}
			if(this.root.page.borrowTimeMode) {
				let adminData = [];
				this.addedData.forEach(data => {
					const copiedData = {
						...data,
						creator: 'admin'
					}
					data.color = '#777';
					adminData.push(copiedData);
				});
				console.log(adminData);
				this.addedData = this.addedData.concat(adminData);
				console.log(this.addedData);
				this.root.page.disableBorrowTimeMode();
			}
			this.addedData.forEach(data => {
				axios.post(`api/`, data);
				if(!isSuper) {
					const start = data.start;
					const end = data.end;
					const inDay = 6 <= start.getHours() && (6 <= end.getHours() || (end.getHours() === 0 && end.getMinutes() === 0));
					if(!inDay)
						this.submitNightData(data);
				}
			});
		}

		this.disableSubmitButton = true;
		this.updatedData = [];
		this.addedData = [];
		this.deletedData = [];
		setTimeout(() => this.getData(true), 1000);
	}

	submitNightData = (data) => {
		const start = data.start.getHours() < 6 ? data.start:new Date(data.start.getFullYear(), data.start.getMonth(), data.start.getDay(), 0, 0);
		const end = data.end.getHours() < 6 ? data.end:new Date(data.end.getFullYear(), data.end.getMonth(), data.end.getDay(), 6, 0);
		const clubColors = {
			'악의꽃': '#79A3F4',
			'막무간애': '#FF6B76',
			'모여락': '#CD9CF4'
		};
		
		const event = {
			start: start,
			end: end,
			title: this.root.page.userclub,
			id: this.root.page.userclub + String(this.setTimeIdx),
			creator: 'admin',
			club: this.root.page.userclub,
			color: clubColors[this.root.page.userclub]
		}
		axios.post(`api/`, event);
	}

	@action
	enableSetCalendarMode = () => {
		this.setTimeSlot.push({
				isFirst: true,
				isLast: true,
				startTime: null,
				endTime: null
		});
		if(this.root.page.isSuper) {
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
		}
		else {
			this.clubCalendar = true;
			this.data = this.data.filter(d => d.club !== this.root.page.userclub)
								 .concat(this.clubData[this.root.page.userclub]);
			this.data.forEach(d => {
				if(this.root.page.username === d.creator)
					d.editable = true;
				else {
					d.editable = false;
					d.color = '#777';
				}
			});
			
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
		const isSuper = this.root.page.isSuper;
		const clubDays = [
			{club: '악의꽃', color: '#79A3F4', days: lfdmDays},
			{club: '막무간애', color: '#FF6B76', days: mmgeDays},
			{club: '모여락', color: '#CD9CF4', days: myrDays}
		];

		if(!startTime || !endTime)
			return;

		let tar;
		if(isSuper) {
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
		if(isSuper) {
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
	changeStartTimeSlot = time => {
		const hour = typeof(time) === String ? Number(time.slice(0, 2)):time.getHours();
		if(!this.setTimeSlot[this.setTimeIdx].endTime || this.setTimeSlot[this.setTimeIdx].endTime > time) {
			if(this.setTimeSlot[this.setTimeIdx].endTime) {
				const end = this.setTimeSlot[this.setTimeIdx].endTime;
				const endH = typeof(end) === String ? Number(end.slice(0, 2)):end.getHours();
				const endM = typeof(end) === String ? Number(end.slice(3)):end.getMinutes();
				const inDay = 6 <= hour && (6 <= endH || (endH === 0 && endM === 0));
				if(!inDay) { // night
					const result = window.confirm('설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다. 계속하시겠습니까?');
					if(!result)
						return;
				}
			}
			this.setTimeSlot[this.setTimeIdx].startTime = time;
			this.displayTimeSlot();
			return;
		}
		console.log(this.setTimeSlot[this.setTimeIdx].endTime);
		alert('시작 시간이 끝 시간보다 나중입니다. 다시 설정해주세요.');
		return;	
	}

	@action
	changeEndTimeSlot = time => { 
		const hour = typeof(time) === String ? Number(time.slice(0, 2)):time.getHours();
		const min = typeof(time) === String ? Number(time.slice(3)):time.getMinutes();
		if(!this.setTimeSlot[this.setTimeIdx].startTime || this.setTimeSlot[this.setTimeIdx].startTime < time) {
			if(this.setTimeSlot[this.setTimeIdx].startTime) {
				const start = this.setTimeSlot[this.setTimeIdx].startTime;
				const startH = typeof(start) === String ? Number(start.slice(0, 2)):start.getHours();
				const inDay = 6 <= startH && (6 <= hour || (hour === 0 && min === 0));
				if(!inDay) { // night
					const result = window.confirm('설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다. 계속하시겠습니까?');
					if(!result)
						return;
				}
				
			}
			this.setTimeSlot[this.setTimeIdx].endTime = time;
			this.displayTimeSlot();
			return;
		}
		alert('끝 시간이 시작시간보다 먼저입니다. 다시 설정해주세요.');
		return;
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

	@action
	switchCalendar = () => {
		this.clubCalendar = !this.clubCalendar;
		this.getData();
	}
}
