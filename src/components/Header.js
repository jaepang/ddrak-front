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
		const isSuper = calendar.root.page.isSuper;
		return(
			<div css={style}>
				<div css={container}>
					<div className='buttons'>
						<ButtonIcon
							size="medium" 
							icon={<FontAwesomeIcon icon={faChevronLeft} />} 
							onClick={calendar.moveLeft}
							disabled={calendar.root.page.setCalendarMode && isSuper}
							css={buttonLeftStyle}
						/>
						<Button
							shaded
							label="오늘"
							variant="border-filled"
							onClick={calendar.moveToday}
							css={buttonStyle}
							disabled={calendar.root.page.setCalendarMode && isSuper}
						/>
						<ButtonIcon
							size="medium" 
							icon={<FontAwesomeIcon icon={faChevronRight} />} 
							onClick={calendar.moveRight}
							disabled={calendar.root.page.setCalendarMode && isSuper}
							css={buttonRightStyle}
						/>
					</div>
					{ !yearChange && <h1>{cur.year}년 {title}월</h1> }
					{ yearChange && 
						<h1>
							{bfDate.getFullYear()}년 {bfDate.getMonth()+1}월-
							{aftDate.getFullYear()}년 {aftDate.getMonth()+1}월
						</h1> 
					}
				</div>
				<div css={containerRight}>
					{ (loggedIn && !isSuper) && 
						<div css={changeCalendarButtons}>
							<Button
								shaded
								label="전체"
								variant="border-filled"
								onClick={calendar.switchCalendar}
								css={buttonLeftStyle}
								disabled={!calendar.clubCalendar || calendar.root.page.setCalendarMode}
							/>
							<Button
								shaded
								label="동아리"
								variant="border-filled"
								onClick={calendar.switchCalendar}
								css={buttonRightStyle}
								disabled={calendar.clubCalendar || calendar.root.page.setCalendarMode}
							/>
						</div>
					}
					{ loggedIn ?
						<Button
							shaded
							label="로그아웃"
							variant="border-filled"
							onClick={calendar.root.page.handleLogout}
							css={singleButtonStyle}
						/>
					:
						<Button
							shaded
							label="로그인"
							variant="border-filled"
							onClick={calendar.root.page.openLoginModal}
							css={singleButtonStyle}
						/>
					}
				</div>
			</div>
		)
	}
}

const style = css `
	padding: 1.5rem 1rem;
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
	width: 25rem;
	height: 100%;
	h1 {
		display: inline;
		transform: translateY(-50%);
	}
	.buttons {
		display: inline;
		vertical-align: top;
		margin-right: 1rem;
		transform: translateY(-50%);
	}
`;
const containerRight = css `
	margin: auto 0;
	position: relative;
	float: right;
	height: 100%;
`;
const buttonLeftStyle = css `
	border: 1px solid #ddd;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	margin-right: -1px;
	height: 38px;
	&:hover:enabled {
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
	&:hover:enabled {
		background-color: #fafafa;
		color: #3C4043;
	}
`;
const buttonStyle = css `
	color: #3C4043;
	margin: 0;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 0;
	height: 38px;
	box-shadow: 0 0 0 0;
	&:hover:enabled {
		background-color: #fafafa;
		color: #3C4043;
	}
`;

const changeCalendarButtons = css `
	margin: auto 0;
	margin-right: 1rem;
	display: inline-block;
`;
const singleButtonStyle = css `
	margin: auto 0;
	display: inline-block;
	float: right;
	color: #3C4043;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 10px;
	height: 38px;
	box-shadow: 0 0 0 0;
	&:hover:enabled {
		background-color: #fafafa;
		color: #3C4043;
	}
`;

export default Header;
