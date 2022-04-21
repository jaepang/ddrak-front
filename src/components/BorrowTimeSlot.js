import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../stores';
import { Input, ButtonIcon, Button, DateTimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const BorrowTimeSlot = observer(() => {
	const { calendar, page } = useStore();
	const prevTimeSlot = () => calendar.prevTimeSlot();
	const nextTimeSlot = () => calendar.nextTimeSlot();
	const changeStartTimeSlot = time => calendar.changeStartTimeSlot(time);
	const changeEndTimeSlot = time => calendar.changeEndTimeSlot(time);
	const changeTitle = title => calendar.changeTitle(title);
	const submitData = () => calendar.submitData();
	const disableSetCalendarMode = () => page.disableSetCalendarMode();

	return (
		<React.Fragment>
			<Container>
				<h3>기타 대여 등록</h3>
				<div>
					<ButtonIcon
						size="medium" 
						icon={<StyledIcon icon={faChevronLeft} />} 
						disabled={calendar.setTimeSlot[calendar.setTimeIdx].isFirst}
						onClick={prevTimeSlot}
					/>
					<ButtonIcon
						size="medium" 
						icon={<StyledIcon icon={faChevronRight} />} 
						onClick={nextTimeSlot}
					/>
				</div>
			</Container>
			<div>
				<Container>
					<TimePicker label="시작 시간"
						value={calendar.setTimeSlot[calendar.setTimeIdx].startTime}
						onChange={t => changeStartTimeSlot(t)}
					/>
					<TimePicker
						label="끝 시간"
						value={calendar.setTimeSlot[calendar.setTimeIdx].endTime}
						onChange={t => changeEndTimeSlot(t)}
					/>
				</Container>
				<Container>
					<StyledInput
						label="대여 대상"
						placeholder="대여 대상 입력"
						type="text"
						value={calendar.setTimeSlot[calendar.setTimeIdx].title}
						className="rainbow-p-around_medium"
						onChange={title => changeTitle(title)}
					/>
				</Container>
				<Container>
					<StyledButton
						label="적용"
						variant="brand"
						disabled={calendar.disableSubmitButton}
						onClick={submitData}
					/>
					<StyledButton
						label="취소"
						variant="destructive"
						onClick={disableSetCalendarMode}
					/>
				</Container>
			</div>
		</React.Fragment>
	);
});

const Container = styled.div`
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
const TimePicker = styled(DateTimePicker)`
	display: inline-block;
	border-radius: 15px;
	width: 44%;
	margin-bottom: 10px;
	input {
		height: 35px;
	}
`;
const StyledButton = styled(Button)`
	display: inline-block;
	border-radius: 15px;
	width: 48% !important;
	height: 40px !important;
	margin-top: 10px;
`;
const StyledIcon = styled(FontAwesomeIcon)`
	color: #3C4043;
`;
const StyledInput = styled(Input)`
	width: 100%;
`

export default BorrowTimeSlot;
