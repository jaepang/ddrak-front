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

@inject('events')
@observer
class Calendar extends Component {

	componentDidMount() {
		this.props.events.fetchEvents();
	}

	render() {
		const { events } = this.props;
		const currentDate = new Date();
		return (
			<Scheduler
				data={events.data}
			>
				<ViewState
					defaultCurrentDate={currentDate}
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
		);
	}
};

export default Calendar
