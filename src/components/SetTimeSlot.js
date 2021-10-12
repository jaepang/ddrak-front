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
		const idxOf = i => this.gridHeader.indexOf(i);
		
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
								<div css={labelContainer} id={e} key={index}>
									<input
										type="radio"
										css={radioInput}
										id={'악의꽃' + String((idxOf(e)+1)%7)}
										checked={cur.days[(idxOf(e)+1)%7] === '악의꽃'}
										onChange={() => this.calendar.changeDays((idxOf(e)+1)%7, '악의꽃')}
									/>
									<label
										css={radioLabel}
										htmlFor={'악의꽃' + String((idxOf(e)+1)%7)}
									>
										<span>악</span>
									</label>
									<input
										type="radio"
										css={radioInput}
										id={'막무간애' + String((idxOf(e)+1)%7)}
										checked={cur.days[(idxOf(e)+1)%7] === '막무간애'}
										onChange={() => this.calendar.changeDays((idxOf(e)+1)%7, '막무간애')}
									/>
									<label
										css={radioLabel}
										htmlFor={'막무간애' + String((idxOf(e)+1)%7)}
									>
										<span>막</span>
									</label>
									<input
										type="radio"
										css={radioInput}
										id={'모여락' + String((idxOf(e)+1)%7)}
										checked={cur.days[(idxOf(e)+1)%7] === '모여락'}
										onChange={() => this.calendar.changeDays((idxOf(e)+1)%7, '모여락')}
									/>
									<label
										css={radioLabel}
										className={idxOf(e)===0||idxOf(e)===6 ? 
											idxOf(e)===0?'border-left':'border-right':'null'}
										htmlFor={'모여락' + String((idxOf(e)+1)%7)}
									>
										<span>모</span>
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
	width: 44%;
	margin-bottom: 10px;
	input {
		border-radius: 15px;
		height: 35px;
	}
`;
const gridContainer = css `
	display: grid;
	background-color: #FFFFFF;
	margin: 0.5rem auto;
	border: 1px solid #A4A7B5;
	border-radius: 15px;
	width: 92.5%;
	height: 20vh;
	grid-template-rows: 1fr 3fr;
	grid-template-columns: repeat(7, 1fr);
	place-items: stretch;
`;
const gridHeader = css `
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	border-bottom: 1px solid #A4A7B5;
	color: #3C4043;
`;
const labelContainer = css `
	display: grid;
	grid-template-rows: 1fr 1fr 1fr;
	grid-template-columns: 1fr;
	place-items: stretch;
	.border-left {
		border-bottom-left-radius: 15px;
	}
	.border-right {
		border-bottom-right-radius: 15px;
	}
`;
const radioInput = css `
	display: none;
	&:checked + label {
		color: #3C4043;
	}
`;
const radioLabel = css `
	display: flex;
	cursor: pointer;
	justify-content: center;
	padding: 0.5rem;
	color: #CCC;
	&:hover {
		color: #3C4043;
		background-color: #FAFAFA;
	}
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
