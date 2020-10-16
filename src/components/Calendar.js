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
import '../styles/calendar.css';

@inject('calendar')
@observer
class Calendar extends Component {
	
	componentDidMount() {
		this.props.calendar.getData();
	}

	render() {
		const { calendar } = this.props;
		return (
			<container className="calendar">
				<Scheduler
					data={calendar.data}
				>
					<ViewState
						currentDate={calendar.currentDate}
						onCurrentDateChange={calendar.currentDateChange}
					/>
					<EditingState/>
					<IntegratedEditing/>
					<EditRecurrenceMenu/>
					<ConfirmationDialog/>
					<WeekView/>
					<Toolbar/>
					<DateNavigator/>
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
			</container>
		);
	}
};

export default Calendar
