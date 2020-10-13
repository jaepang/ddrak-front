import React from 'react';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  	Scheduler,
  	WeekView,
	Toolbar,
	DateNavigator,
	TodayButton,
  	Appointments,
  	AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2020-10-10';

const Calendar = ({data}) => {
	return (
		<Scheduler
			data={data}
		>
			<ViewState
				currentDate={currentDate}
			/>
			<WeekView/>
			<Toolbar/>
			<DateNavigator/>
			<TodayButton/>
			<Appointments/>
		</Scheduler>
	);
};

export default Calendar
