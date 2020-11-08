import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

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
	componentDidUpdate() {
		if(this.calendar.root.page.setCalendarMode) {
			const container = document.getElementById('externalEvents');
			new Draggable(container, {
				itemSelector: '.fc-event',
				eventData: eventEl => {
					const color = {
						'악의꽃': '#79A3F4',
						'막무간애': '#FF6B76',
						'모여락': '#CD9CF4'
					};
					return {
	    				title: eventEl.innerText,
					    duration: '02:00',
						color: color[eventEl.innerText]
					};
				}
			});
		}
	}
	handleEventClick = (info) => alert(info.event.startTime)
	handleEventReceive = info => this.calendar.eventReceive(info.event)

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
					eventReceive={this.handleEventReceive}
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
