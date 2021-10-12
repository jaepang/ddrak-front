/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Input, ButtonIcon, Button, DateTimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@inject ('calendar')
@observer
class BorrowTimeSlot extends Component {
	calendar = this.props.calendar;
	page = this.calendar.root.page;
	
	render() {
		const idx = this.calendar.setTimeIdx;
		const resources = this.calendar.setTimeSlot;
		const cur = resources[idx];
		
		return(
			<React.Fragment>
				<div css={container}>
					<h3>기타 대여 등록</h3>
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
								label="대여 대상"
								placeholder="대여 대상 입력"
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
	width: 44%;
	margin-bottom: 10px;
	input {
		height: 35px;
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

export default BorrowTimeSlot;
