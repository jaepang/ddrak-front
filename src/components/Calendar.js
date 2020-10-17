import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { 
	ViewState,
	EditingState,
	IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  	Scheduler,
  	WeekView,
	ViewSwitcher,
	Toolbar,
	DateNavigator,
	TodayButton,
  	Appointments,
	AppointmentTooltip,
	AppointmentForm,
	ConfirmationDialog,
  	AllDayPanel,
	EditRecurrenceMenu,
	DragDropProvider
} from '@devexpress/dx-react-scheduler-material-ui';

const vh = (v) => {
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

@inject('calendar')
@observer
class Calendar extends Component {
	
	componentDidMount() {
		this.props.calendar.getData();
	}

	render() {
		const { calendar } = this.props;
		return (
				<Scheduler
					data={calendar.data}
					height={vh(100)}
				>
					<ViewState
						currentDate={calendar.currentDate}
						defaultCurrentView="Day"
						onCurrentDateChange={calendar.currentDateChange}
					/>
					<EditingState/>
					<IntegratedEditing/>
					<EditRecurrenceMenu/>
					<ConfirmationDialog/>
					<WeekView
						displayName="Day"
						startDayHour={6}
						endDayHour={24}
					/>
					<WeekView
						name="Night"
						displayName="Night"
						startDayHour={0}
						endDayHour={6}
					/>
					<Toolbar/>
					<DateNavigator/>
					<ViewSwitcher/>
					<AllDayPanel/>
					<TodayButton/>
					<Appointments/>
					<AppointmentTooltip
						showOpenButton
						showDeleteButton
					/>
					<AppointmentForm/>
					<DragDropProvider/>
				</Scheduler>
		);
	}
};

export default Calendar
