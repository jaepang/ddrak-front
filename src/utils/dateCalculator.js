import moment from 'moment';
import 'moment/locale/ko';
moment.locale('ko');

export const calcHeaderDate = cur => {
	const year = cur.getFullYear();
	const month = cur.getMonth()+1;
	const date = cur.getDate();
	let day = new Date(year, month-1, date).getDay();
	if(day === 0)
		day = 7;
	let header;
	let bfDate = new Date(year, month-1, date-day+1);
	let aftDate = new Date(year, month-1, date-day+7);

	if(bfDate.getMonth() < month-1 || bfDate.getFullYear() < year) {
		aftDate = new Date(cur.year, cur.month-1, cur.date);
		if(bfDate.getFullYear() !== cur.getFullYear())
			header = moment(bfDate).format('Y[년] M[월]-') + moment(cur).format('Y[년] M[월]');
		else
			header = moment(bfDate).format('Y[년] M[월]-') + moment(cur).format('M[월]'); 
	}
	else if(aftDate.getMonth() > month-1 || year < aftDate.getFullYear()) {
		bfDate = new Date(cur.year, cur.month-1, cur.date);
		if(cur.getFullYear() !== aftDate.getFullYear()) 
			header = moment(cur).format('Y[년] M[월]-') + moment(aftDate).format('Y[년] M[월]');
		else
			header = moment(cur).format('Y[년] M[월]-') + moment(aftDate).format('M[월]')
	}
	else
		header = moment(cur).format('Y[년] M[월]');
	
	return header;
}

export const getFirstMon = (date) => {
	let mon = new Date(date.getFullYear(), date.getMonth(), 1);
	while(mon.getDay() !== 1)
		mon.setDate(mon.getDate()+1);
	return mon;
}


export const getFirstDay = (day, date) => {
	let tar = new Date(date.getFullYear(), date.getMonth(), 1);
	while(tar.getDay() !== day)
		tar.setDate(tar.getDate()+1);
	return tar;
}

export const dayParser = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6
};
export const inDay = (start, end) => 6 <= start.getHours() && (6 <= end.getHours() || (end.getHours() === 0 && end.getMinutes() === 0));

export const nightTime = (date, isStart) => {
	if(isStart)
		return date.getHours() < 6 ? date:new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 0, 0);
	else
		return date.getHours() < 6 ? date:new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0);
}

export const isBorrowed = (creator, club) => creator !== 'admin' && creator.slice(0, -5) !== club;

export const isInBoundary = (date, curDate) => {
	const day = curDate.getDay();
	const mon = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()-day+1, 5, 59);
	const sun = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()-day+8, 6, 1);
	return (mon < date && date < sun) || mon.getTime() === date.getTime() || sun.getTime() === date.getTime();
}