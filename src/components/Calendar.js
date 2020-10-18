import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

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
			<FullCalendar
				plugins={[ timeGridPlugin ]}
	    	    initialView="timeGridWeek"
				height={ vh(100) }
				events={ calendar.data }
				slotMinTime="06:00:00"
				slotMaxTime="30:00:00"
			/>
		);
	}
};

export default Calendar
