import { Component } from 'react';
import { observer, inject } from 'mobx-react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ButtonIcon, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { calcMonth } from '../utils/dateCalculator';

@inject('calendar')
@observer
class Header extends Component {
	render() {
		const { calendar } = this.props;
		const cur = calendar.curDateObj;
		const { bfDate, aftDate, yearChange, title } = calcMonth(cur);
		return(
			<div css={style}>
				{ !yearChange && <h1>{cur.year}년 {title}월</h1> }
				{ yearChange && 
					<h1>
						{bfDate.getFullYear()}년 {bfDate.getMonth()+1}월-
						{aftDate.getFullYear()}년 {aftDate.getMonth()+1}월
					</h1> 
				}
				<div>
					<ButtonIcon
						size="large" 
						icon={<FontAwesomeIcon css={iconStyle} icon={faChevronLeft} />} 
						onClick={calendar.moveLeft}
						disabled={calendar.root.page.setCalendarMode}
					/>
					<ButtonIcon
						size="large" 
						icon={<FontAwesomeIcon css={iconStyle} icon={faChevronRight} />} 
						onClick={calendar.moveRight}
						disabled={calendar.root.page.setCalendarMode}
					/>
					<Button
						shaded
						label="오늘"
						variant="border-filled"
						onClick={calendar.moveToday}
						css={buttonStyle}
						disabled={calendar.root.page.setCalendarMode}
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
		color: #3C4043;
		margin: 0;
	}
`;
const buttonStyle = css `
	color: #3C4043;
	border: none;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
`;
const iconStyle = css `
	color: #3C4043;
`;

export default Header;
