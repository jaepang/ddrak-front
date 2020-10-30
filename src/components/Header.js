import { Component } from 'react';
import { observer, inject } from 'mobx-react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ButtonIcon, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@inject('calendar')
@observer
class Header extends Component {
	bfDate;
	aftDate;
	yearChange;
	month;

	calcMonth = (cur) => {
		const { year, month, date } = cur;
		let day = new Date(year, month-1, date).getDay();
		if(day === 0)
			day = 7;
		const prevTest = new Date(year, month-1, date-day+1);
		const nextTest = new Date(year, month-1, date-day+7);
		if(prevTest.getMonth() < month-1 || prevTest.getFullYear() < year) {
			this.bfDate = prevTest;
			this.aftDate = new Date(cur.year, cur.month-1, cur.date);
			this.yearChange = this.bfDate.getFullYear() !== this.aftDate.getFullYear();
			this.month = `${this.bfDate.getMonth()+1}-${cur.month}`;
		}
		else if(nextTest.getMonth() > month-1 || year < nextTest.getFullYear()) {
			this.bfDate = new Date(cur.year, cur.month-1, cur.date);
			this.aftDate = nextTest;
			this.yearChange = this.bfDate.getFullYear() !== this.aftDate.getFullYear();
			this.month = `${cur.month}-${this.aftDate.getMonth()+1}`;
		}
		else {
			this.yearChange = false;
			this.month = `${cur.month}`;
		}
	}
	render() {
		const { calendar } = this.props;
		const cur = calendar.curDateObj;
		this.calcMonth(cur);
		return(
			<div css={style}>
				{ !this.yearChange && <h1>{cur.year}년 {this.month}월</h1> }
				{ this.yearChange && 
					<h1>
						{this.bfDate.getFullYear()}년 {this.bfDate.getMonth()+1}월-
						{this.aftDate.getFullYear()}년 {this.aftDate.getMonth()+1}월
					</h1> 
				}
				<div>
					<ButtonIcon
						size="large" 
						icon={<FontAwesomeIcon icon={faChevronLeft} />} 
						onClick={calendar.moveLeft}
					/>
					<ButtonIcon
						size="large" 
						icon={<FontAwesomeIcon icon={faChevronRight} />} 
						onClick={calendar.moveRight}
					/>
					<Button
						shaded
						label="오늘"
						variant="border-filled"
						onClick={calendar.moveToday}
						css={buttonStyle}
					/>
				</div>
			</div>
		)
	}
}

const style = css `
	padding: 1.5rem;
	padding-bottom: 0;
	display: flex;
    justify-content: space-between;
	h1 {
		margin: 0;
	}
`;
const buttonStyle = css `
	border: none;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
`;

export default Header;
