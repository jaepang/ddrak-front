import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core';
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

	handleEventClick = (info) => alert(info.event.startTime)

	handleEventChange = (changeInfo) => {
		this.calendar.eventChange(changeInfo);
	}

	render() {
		const { calendar } = this.props;
		return (
			<div css={style}>
				<Global styles={globalStyle}/>
				<FullCalendar
					ref={ this.calendarRef }
					plugins={[ timeGridPlugin, interactionPlugin ]}
	    		    initialView="timeGridWeek"
					firstDay={1}
					headerToolbar={false}
					allDaySlot={false}
					height={ vh(85) }
					events={ calendar.data }
					slotMinTime="06:00:00"
					slotMaxTime="30:00:00"
					editable={calendar.root.page.isAdmin}
					droppable={calendar.root.page.isAdmin}
					eventClick={ this.handleEventClick }
					eventChange = { this.handleEventChange }
				/>
			</div>
		);
	}
};

const globalStyle = css `
	::-webkit-scrollbar {
	    width: 0px;
    	background: transparent;
	}
`;
const style = css `
	padding: 1.5rem;
`;

export default Calendar;
