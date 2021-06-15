import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import moment from 'moment';
import 'moment/locale/ko';

const vh = (v) => {
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}
moment.locale('ko');

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
						'모여락': '#CD9CF4',
						'합주': '#79A3F4',
						'합주 테스트': '#FF6B76',
						'공연': '#CD9CF4'
					};
					return {
						id: eventEl.innerText + new Date().toISOString(),
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
			<div css={cardStyle}>
				<Global styles={globalStyle}/>
				<FullCalendar
					ref={ this.calendarRef }
					plugins={[ timeGridPlugin, interactionPlugin ]}
					initialView="timeGridWeek"
					firstDay={1}
					headerToolbar={false}
					allDaySlot={false}
					height={ vh(80) }
					events={ calendar.data }
					slotMinTime="06:00:00"
					slotMaxTime="30:00:00"
					editable={calendar.root.page.isAdmin}
					droppable={calendar.root.page.isAdmin}
					eventReceive={this.handleEventReceive}
					eventClick={ this.handleEventClick }
					eventChange = { this.handleEventChange }
					slotDuration='01:00:00'
					slotLabelFormat={ (args) =>
						<p>{moment(args.date).format("HH[:00]")}</p>
					}
					dayHeaderContent={ (args) => 
						<div>
							<p>{moment(args.date).format("ddd")}</p>
							<h2>{moment(args.date).format("D")}</h2>
						</div>
					}
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
	.fc-scrollgrid {
		border: none !important;
	}
	.fc-scrollgrid td:last-of-type {
		border-right: none !important;
	}
	.fc-col-header-cell-cushion {
		h2 {
			font-size: 25px;
			margin: 0.25rem auto;
			padding: 0.4rem;
			border-radius: 100%;

			font-weight: 400;
			text-align: center;
			line-height: 32px;
			letter-spacing: 2px;
		}
		p {
			font-size: 0.7rem;
			margin: 0 auto;
		}
		white-space: pre;
	}
	.fc-day-today {
		background-color: #fff !important;
		h2 {
			background-color: #00A3DC !important;
			color: white;
		}
	}
`;
const cardStyle = css `
	background-color: #fff;
	height: 75%;
	margin: 2rem auto;
	padding: 1.5rem;
	border: none;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
`;

export default Calendar;
