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
		const loggedIn = calendar.root.page.loggedIn;
		const isFullAdmin = calendar.root.page.isSuper;
		return(
			<div css={style}>
				<div css={container}>
					{ !yearChange && <h1>{cur.year}년 {title}월</h1> }
					{ yearChange && 
						<h1>
							{bfDate.getFullYear()}년 {bfDate.getMonth()+1}월-
							{aftDate.getFullYear()}년 {aftDate.getMonth()+1}월
						</h1> 
					}
					<div className='buttons'>
						<ButtonIcon
							size="medium" 
							icon={<FontAwesomeIcon css={iconStyle} icon={faChevronLeft} />} 
							onClick={calendar.moveLeft}
							disabled={calendar.root.page.setCalendarMode && isFullAdmin}
							css={buttonLeftStyle}
						/>
						<Button
							shaded
							label="오늘"
							variant="border-filled"
							onClick={calendar.moveToday}
							css={buttonStyle}
							disabled={calendar.root.page.setCalendarMode && isFullAdmin}
						/>
						<ButtonIcon
							size="medium" 
							icon={<FontAwesomeIcon css={iconStyle} icon={faChevronRight} />} 
							onClick={calendar.moveRight}
							disabled={calendar.root.page.setCalendarMode && isFullAdmin}
							css={buttonRightStyle}
						/>
					</div>
				</div>
				{ (loggedIn && !isFullAdmin) && 
					<div css={css `margin:auto 0;`}>
					<Button
						shaded
						label="전체 시간표"
						variant="border-filled"
						onClick={calendar.switchCalendar}
						css={buttonLeftStyle}
						disabled={!calendar.clubCalendar}
					/>
					<Button
						shaded
						label="동아리 시간표"
						variant="border-filled"
						onClick={calendar.switchCalendar}
						css={buttonRightStyle}
						disabled={calendar.clubCalendar}
					/>
				</div>
				}
				{ loggedIn ?
					<div css={css `margin:auto 0;`}>
						<Button
							shaded
							label="로그아웃"
							variant="border-filled"
							onClick={calendar.root.page.handleLogout}
							css={singleButtonStyle}
						/>
					</div>
				:
					<div css={css `margin:auto 0;`}>
						<Button
							shaded
							label="로그인"
							variant="border-filled"
							onClick={calendar.root.page.openLoginModal}
							css={singleButtonStyle}
						/>
					</div>
				}
			</div>
		)
	}
}

const style = css `
	padding: 1.5rem;
	display: flex;
    justify-content: space-between;
	h1 {
		color: #3C4043;
		margin: 0;
	}
	border-bottom: 1px solid #ddd;
`;
const container = css `
	margin: auto 0;
	position: relative;
	width: 80%;
	height: 100%;
	h1 {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}
	.buttons {
		position: absolute;
		top: 55%;
		left: 12em;
		transform: translateY(-50%);
	}
`;
const buttonLeftStyle = css `
	border: 1px solid #ddd;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	margin-right: -1px;
	height: 38px;
	&:hover {
		background-color: #fafafa;
		color: #3C4043;
	}
	
`;
const buttonRightStyle = css `
	border: 1px solid #ddd;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	margin-left: -1px;
	height: 38px;
	&:hover {
		background-color: #fafafa;
		color: #3C4043;
	}
`;
const buttonStyle = css `
	color: #3C4043;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 0;
	height: 38px;
	box-shadow: 0 0 0 0;
	&:hover {
		background-color: #fafafa;
		color: #3C4043;
	}
`;
const singleButtonStyle = css `
	color: #3C4043;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 10px;
	height: 38px;
	box-shadow: 0 0 0 0;
	&:hover {
		background-color: #fafafa;
		color: #3C4043;
	}
`;
const iconStyle = css `
	color: #3C4043;
`;

export default Header;
