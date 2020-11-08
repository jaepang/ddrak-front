/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { Card, Calendar } from 'react-rainbow-components';
import { observer, inject } from 'mobx-react';
import UserMenu from './UserMenu';
import ExternalEvents from './ExternalEvents';
import SetTimeSlot from './SetTimeSlot';

@inject('calendar')
@observer
class Sidebar extends Component {
	curYear = new Date().getFullYear();
	minDate = new Date(this.curYear-5, 0, 1);
	maxDate = new Date(this.curYear+5, 11, 31);

	render() {
		const { calendar } = this.props;
		const date = calendar.curDateObj;
		return (
			<div css={style}>
				<h1>화요뜨락</h1>
				<Card css={cardStyle}>
					{ !calendar.root.page.setCalendarMode && 
						<Calendar 
							value={new Date(date.year, date.month-1, date.date)}
							onChange={calendar.currentDateChange}
							minDate={this.minDate}
							maxDate={this.maxDate}
						/>
					}
					{ calendar.root.page.setCalendarMode &&
						<ExternalEvents />
					}
				</Card>
				<Card css={cardStyle}>
					{ !calendar.root.page.setCalendarMode &&
						<UserMenu />
					}
					{ calendar.root.page.setCalendarMode &&
							<SetTimeSlot />
					}
				</Card>
			</div>
		);
	}
}

const style = css `
	display: block;
	height: 100vh;
	padding: 1.5rem;
`
const cardStyle = css `
	width: 85%;
	padding: 1.5rem;
	margin: 0 auto;
	margin-bottom: 2rem;
	border: none;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
	&:hover {
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
	}
`

export default Sidebar;
