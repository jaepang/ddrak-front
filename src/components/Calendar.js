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
	handleEventClick = (info) => alert(info.event.title)
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
					height={ vh(89.8) }
					events={ calendar.data }
					slotMinTime="06:00:00"
					slotMaxTime="30:00:00"
					editable={calendar.root.page.isAdmin}
					droppable={calendar.root.page.isAdmin}
					eventReceive={this.handleEventReceive}
					eventClick={ this.handleEventClick }
					eventChange = { this.handleEventChange }
					slotDuration='00:30:00'
					slotLabelFormat={ (args) =>
						<p>{moment(args.date).format("A h[시]")}</p>
					}
					dayHeaderContent={ (args) => 
						<div>
							<p>{moment(args.date).format("ddd[ ]")}</p>
							<h2>{moment(args.date).format("D")}</h2>
						</div>
					}
					eventTimeFormat={ (args) =>
						(moment
							.duration(moment(args.end).diff(moment(args.date)))
							.asHours() >= 1.5
						)
						&& 
						<p>{
							moment(args.date).format("A h[시] mm[분]")
							.replace("00분", "")
						}</p>
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
	.fc-col-header {
		background-color: #F9F7FB;
	}
	.fc-col-header-cell-cushion {
		h2 {
			display: inline;
			font-size: 1.3rem;
			margin: 0.25rem auto;
			padding: 0.4rem;
			border-radius: 100%;

			font-weight: 400;
			text-align: center;
			line-height: 50px;
			letter-spacing: 2px;
		}
		p {
			display: inline;
			font-weight: 400;
			font-size: 1.2rem;
			margin: 0.4rem 0 auto;
		}
	}
	.fc-day-today h2 {
		background-color: #00A3DC !important;
		color: white;
	}
	.fc-timegrid-col.fc-day-today {
		background-color: #FFF !important;
	}
	.fc-timegrid-slot-label-cushion p {
		margin: 0 auto;
		font-size: 0.9rem;
		letter-spacing: -1px;
	}
	.fc-event-main-frame {
		padding-left: 0.7rem;
	}
	.fc-timegrid-event {
		border-radius: 15px;
		p {
			margin: 0.7rem 0 0.3rem 0;
			font-weight: 300;
			font-size: 0.95rem;
		}
	}
	.fc-event-title {
		margin-top: 0.1rem;
		font-weight: 400;
		font-size: 1.2rem;
	}
`;
const cardStyle = css `
	background-color: #fff;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	border: none;
`;

export default Calendar;
