import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
//import DraggableEvent from './DraggableEvent';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const vh = (v) => {
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

@inject('calendar')
@observer
class Calendar extends Component {
	
	calendar = this.props.calendar;
	calendarRef = React.createRef();

	componentDidMount() {
		this.calendar.getData();
		this.calendar.getCalendarApi(this.calendarRef.current.getApi());
	}

	handleEventChange = (changeInfo) => {
		this.calendar.eventChange(changeInfo);
	}

	render() {
		const { calendar } = this.props;
		return (
			<container>
			<FullCalendar
				ref={ this.calendarRef }
				plugins={[ timeGridPlugin, interactionPlugin ]}
	    	    initialView="timeGridWeek"
				height={ vh(80) }
				events={ calendar.data }
				slotMinTime="06:00:00"
				slotMaxTime="30:00:00"
				editable={true}
				droppable={true}
				eventChange = { this.handleEventChange }
			/>
			<button onClick={ calendar.submitData } disabled={calendar.disableSubmitButton}>
			submit data
			</button>
			</container>
		);
	}
};

export default Calendar
