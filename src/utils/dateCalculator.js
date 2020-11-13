export const calcMonth = (cur) => {
	const { year, month, date } = cur;
	let day = new Date(year, month-1, date).getDay();
	let obj = { bfDate: null, aftDate: null, yearChange: null, title: null };
	if(day === 0)
		day = 7;
	const prevTest = new Date(year, month-1, date-day+1);
	const nextTest = new Date(year, month-1, date-day+7);
	if(prevTest.getMonth() < month-1 || prevTest.getFullYear() < year) {
		obj.bfDate = prevTest;
		obj.aftDate = new Date(cur.year, cur.month-1, cur.date);
		obj.yearChange = obj.bfDate.getFullYear() !== obj.aftDate.getFullYear();
		obj.title = `${obj.bfDate.getMonth()+1}-${cur.month}`;
	}
	else if(nextTest.getMonth() > month-1 || year < nextTest.getFullYear()) {
		obj.bfDate = new Date(cur.year, cur.month-1, cur.date);
		obj.aftDate = nextTest;
		obj.yearChange = obj.bfDate.getFullYear() !== obj.aftDate.getFullYear();
		obj.title = `${cur.month}-${obj.aftDate.getMonth()+1}`;
	}
	else {
		obj.yearChange = false;
		obj.title = `${cur.month}`;
	}
	return obj;
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
