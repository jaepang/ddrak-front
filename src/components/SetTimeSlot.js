/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { ButtonIcon, Button, WeekDayPicker, TimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@inject ('calendar')
@observer
class SetTimeSlot extends Component {
	calendar = this.props.calendar;
	page = this.calendar.root.page;
	render() {
		return(
			<div>
				<h3>시간대별 설정</h3>
				<div css={container}>
					<TimePicker
						label="시작 시간"
						css={timePicker}
					/>
					<TimePicker
						label="끝 시간"
						css={timePicker}
					/>
				</div>
				<WeekDayPicker
					multiple
					label="악의꽃"
					labelAlignment="left"
					css={weekdayPicker}
				/>
				<WeekDayPicker
					multiple
					label="막무간애"
					labelAlignment="left"
					css={weekdayPicker}
				/>
				<WeekDayPicker
					multiple
					label="모여락"
					labelAlignment="left"
					css={weekdayPicker}
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
		);
	}
}

const container = css `
	display: flex;
	justify-content: space-between;
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
	width: 48%;
	margin-top: 10px;
`;

export default SetTimeSlot;
