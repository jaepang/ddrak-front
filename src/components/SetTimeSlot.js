/* @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Input, ButtonIcon, Button, WeekDayPicker, TimePicker, DateTimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@inject ('calendar')
@observer
class SetTimeSlot extends Component {
	calendar = this.props.calendar;
	page = this.calendar.root.page;
	isFullAdmin = this.page.username === 'admin';
	defaultDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
	render() {
		const idx = this.calendar.setTimeIdx;
		const resources = this.calendar.setTimeSlot;
		const cur = resources[idx];
		const lfdmAvailable = this.isFullAdmin ? this.defaultDays.filter(el => !(cur.mmgeDays.includes(el) || cur.myrDays.includes(el))) : null;
		const mmgeAvailable = this.isFullAdmin ? this.defaultDays.filter(el => !(cur.lfdmDays.includes(el) || cur.myrDays.includes(el))) : null;
		const myrAvailable = this.isFullAdmin ? this.defaultDays.filter(el => !(cur.lfdmDays.includes(el) || cur.mmgeDays.includes(el))) : null;
		
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
						<div css={container}>
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
						<WeekDayPicker
							multiple
							label="악의꽃"
							labelAlignment="left"
							css={weekdayPicker}
							value={cur.lfdmDays}
							availableDates={lfdmAvailable}
							onChange={days => this.calendar.changeDays('lfdmDays', days)}
						/>
						<WeekDayPicker
							multiple
							label="막무간애"
							labelAlignment="left"
							css={weekdayPicker}
							value={cur.mmgeDays}
							availableDates={mmgeAvailable}
							onChange={days => this.calendar.changeDays('mmgeDays', days)}
						/>
						<WeekDayPicker
							multiple
							label="모여락"
							labelAlignment="left"
							css={weekdayPicker}
							value={cur.myrDays}
							availableDates={myrAvailable}
							onChange={days => this.calendar.changeDays('myrDays', days)}
						/>
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
								css={css`width: 100%;`}
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
const timePicker = css `
	display: inline-block;
	border-radius: 15px;
	width: 48%;
	margin-bottom: 10px;
	input {
		height: 35px;
	}
`;
const weekdayPicker = css `
	margin-bottom: 1.5rem;
	legend {
		margin-left: 3%;
		margin-bottom: 5px;
		text-align: left;
	}
	label {
		width: 12%;
		font-size: 0.9rem;
		border-radius: 15px;
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
