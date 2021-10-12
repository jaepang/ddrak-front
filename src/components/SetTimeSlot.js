/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Input, ButtonIcon, Button, TimePicker, DateTimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@inject ('calendar')
@observer
class SetTimeSlot extends Component {
	calendar = this.props.calendar;
	page = this.calendar.root.page;
	isFullAdmin = this.page.username === 'admin';
	gridHeader = ['월', '화', '수', '목', '금', '토', '일'];
	render() {
		const idx = this.calendar.setTimeIdx;
		const resources = this.calendar.setTimeSlot;
		const cur = resources[idx];
		
		return(
			<React.Fragment>
				<div css={container}>
					<h3>{ this.isFullAdmin ? '시간대별 설정':'새로운 일정' }</h3>
					<div>
						<ButtonIcon
							size="medium" 
							icon={<FontAwesomeIcon css={iconStyle} icon={faChevronLeft} />} 
							disabled={cur.isFirst}
							onClick={this.calendar.prevTimeSlot}
						/>
						<ButtonIcon
							size="medium" 
							icon={<FontAwesomeIcon css={iconStyle} icon={faChevronRight} />} 
							onClick={this.calendar.nextTimeSlot}
						/>
					</div>
				</div>
				
				{ this.isFullAdmin ? (
					<div>
						<div css={timeContainer}>
							<TimePicker label="시작 시간"
								css={timePicker}
								value={cur.startTime}
								onChange={t => this.calendar.changeStartTimeSlot(t)}
							/>
							<TimePicker
								label="끝 시간"
								css={timePicker}
								value={cur.endTime}
								onChange={t => this.calendar.changeEndTimeSlot(t)}
							/>
						</div>
						<div css={gridContainer}>
							{this.gridHeader.map((e, index) => (
								<div css={gridHeader} key={index}>
									{e.toString()}
								</div>
							))}
							{ this.gridHeader.map((e, index) => (
								<div id={e} key={index}>
									<input
										type="radio"
										css={radioInput}
										id={'악의꽃' + String((this.gridHeader.indexOf(e)+1)%7)}
										checked={cur.days[(this.gridHeader.indexOf(e)+1)%7] === '악의꽃'}
										onChange={() => this.calendar.changeDays((this.gridHeader.indexOf(e)+1)%7, '악의꽃')}
									/>
									<label
										htmlFor={'악의꽃' + String((this.gridHeader.indexOf(e)+1)%7)}
									>
										악의꽃
									</label>
									<input
										type="radio"
										css={radioInput}
										id={'막무간애' + String((this.gridHeader.indexOf(e)+1)%7)}
										checked={cur.days[(this.gridHeader.indexOf(e)+1)%7] === '막무간애'}
										onChange={() => this.calendar.changeDays((this.gridHeader.indexOf(e)+1)%7, '막무간애')}
									/>
									<label
										htmlFor={'막무간애' + String((this.gridHeader.indexOf(e)+1)%7)}
									>
										막무간애
									</label>
									<input
										type="radio"
										css={radioInput}
										id={'모여락' + String((this.gridHeader.indexOf(e)+1)%7)}
										checked={cur.days[(this.gridHeader.indexOf(e)+1)%7] === '모여락'}
										onChange={() => this.calendar.changeDays((this.gridHeader.indexOf(e)+1)%7, '모여락')}
									/>
									<label
										htmlFor={'모여락' + String((this.gridHeader.indexOf(e)+1)%7)}
									>
										모여락
									</label>
								</div>
							))}
						</div>
						<div css={container}>
							<Button
								label="적용"
								variant="brand"
								css={buttonStyle}
								disabled={this.calendar.disableSubmitButton}
								onClick={this.calendar.submitData}
							/>
							<Button
								label="취소"
								variant="destructive"
								css={buttonStyle}
								onClick={this.page.disableSetCalendarMode}
							/>
						</div>
					</div>
				) : (
					<div>
						<div css={container}>
							<DateTimePicker label="시작 시간"
								css={timePicker}
								value={cur.startTime}
								onChange={t => this.calendar.changeStartTimeSlot(t)}
							/>
							<DateTimePicker
								label="끝 시간"
								css={timePicker}
								value={cur.endTime}
								onChange={t => this.calendar.changeEndTimeSlot(t)}
							/>
						</div>
						<div css={container}>
							<Input
								label="제목"
								placeholder="새로운 일정"
								type="text"
								css={css `width: 100%;`}
								value={cur.title}
								className="rainbow-p-around_medium"
								onChange={title => this.calendar.changeTitle(title)}
							/>
						</div>
						<div css={container}>
							<Button
								label="적용"
								variant="brand"
								css={buttonStyle}
								disabled={this.calendar.disableSubmitButton}
								onClick={this.calendar.submitData}
							/>
							<Button
								label="취소"
								variant="destructive"
								css={buttonStyle}
								onClick={this.page.disableSetCalendarMode}
							/>
						</div>
					</div>
				)
			}	
			</React.Fragment>
		);
	}
};

const container = css `
	display: flex;
	justify-content: space-between;
	button {
		width: 1.5rem;
		height: 1.5rem;
		&:disabled {
			svg {
				color: #D7D7D7;
			}
		}
	}
`;
const timeContainer = css `
	display: flex;
	justify-content: space-around;
	button {
		width: 1.5rem;
		height: 1.5rem;
		&:disabled {
			svg {
				color: #D7D7D7;
			}
		}
	}
`;
const timePicker = css `
	display: inline-block;
	border-radius: 15px;
	width: 44%;
	margin-bottom: 10px;
	input {
		height: 35px;
	}
`;
const gridContainer = css `
	display: grid;
	margin: 0 auto;
	width: 90%;
	grid-template-rows: repeat(2, 1fr);
	grid-template-columns: repeat(7, 1fr);
`;
const gridHeader = css `
	display: inline;
	text-align: center;
	border: 1px solid black;
`;
const radioInput = css `
	/*display: none;*/
`;
const radioLabel = css `

`;
const buttonStyle = css `
	display: inline-block;
	border-radius: 15px;
	width: 48% !important;
	height: 40px !important;
	margin-top: 10px;
`;
const iconStyle = css `
	color: #3C4043;
`;

export default SetTimeSlot;
