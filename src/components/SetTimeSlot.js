import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../stores';
import { Input, ButtonIcon, Button, TimePicker, DateTimePicker } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const SetTimeSlot = observer(() => {
	const { calendar, page } = useStore();
	const prevTimeSlot = () => calendar.prevTimeSlot();
	const nextTimeSlot = () => calendar.nextTimeSlot();
	const changeStartTimeSlot = time => calendar.changeStartTimeSlot(time);
	const changeEndTimeSlot = time => calendar.changeEndTimeSlot(time);
	const changeDays = (day, club) => calendar.changeDays(day, club);
	const changeTitle = title => calendar.changeTitle(title);
	const submitData = () => calendar.submitData();
	const disableSetCalendarMode = () => page.disableSetCalendarMode();

	const gridHeader = ['월', '화', '수', '목', '금', '토', '일'];
	const idxOf = i => gridHeader.indexOf(i);
		
	return (
		<React.Fragment>
			<Container>
				<h3>{ page.isSuper ? '시간대별 설정':'새로운 일정' }</h3>
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
			
			{ page.isSuper ? (
				<div>
					<TimeContainer>
						<StyledTimePicker label="시작 시간"
							value={calendar.setTimeSlot[calendar.setTimeIdx].startTime}
							onChange={t => changeStartTimeSlot(t)}
						/>
						<StyledTimePicker
							label="끝 시간"
							value={calendar.setTimeSlot[calendar.setTimeIdx].endTime}
							onChange={t => changeEndTimeSlot(t)}
						/>
					</TimeContainer>
					<GridContainer>
						{gridHeader.map((e, index) => (
							<GridHeader key={index}>
								{e.toString()}
							</GridHeader>
						))}
						{ gridHeader.map((e, index) => (
							<LabelContainer id={e} key={index}>
								<RadioInput
									type="radio"
									id={'악의꽃' + String((idxOf(e)+1)%7)}
									checked={calendar.setTimeSlot[calendar.setTimeIdx].days[(idxOf(e)+1)%7] === '악의꽃'}
									onChange={() => changeDays((idxOf(e)+1)%7, '악의꽃')}
								/>
								<RadioLabel
									htmlFor={'악의꽃' + String((idxOf(e)+1)%7)}
								>
									<span>악</span>
								</RadioLabel>
								<RadioInput
									type="radio"
									id={'막무간애' + String((idxOf(e)+1)%7)}
									checked={calendar.setTimeSlot[calendar.setTimeIdx].days[(idxOf(e)+1)%7] === '막무간애'}
									onChange={() => changeDays((idxOf(e)+1)%7, '막무간애')}
								/>
								<RadioLabel
									htmlFor={'막무간애' + String((idxOf(e)+1)%7)}
								>
									<span>막</span>
								</RadioLabel>
								<RadioInput
									type="radio"
									id={'모여락' + String((idxOf(e)+1)%7)}
									checked={calendar.setTimeSlot[calendar.setTimeIdx].days[(idxOf(e)+1)%7] === '모여락'}
									onChange={() => changeDays((idxOf(e)+1)%7, '모여락')}
								/>
								<RadioLabel
									className={idxOf(e)===0||idxOf(e)===6 ? 
										idxOf(e)===0?'border-left':'border-right':'null'}
									htmlFor={'모여락' + String((idxOf(e)+1)%7)}
								>
									<span>모</span>
								</RadioLabel>
							</LabelContainer>
						))}
					</GridContainer>
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
			) : (
				<div>
					<Container>
						<StyledDateTimePicker label="시작 시간"
							value={calendar.setTimeSlot[calendar.setTimeIdx].startTime}
							onChange={t => changeStartTimeSlot(t)}
						/>
						<StyledDateTimePicker
							label="끝 시간"
							value={calendar.setTimeSlot[calendar.setTimeIdx].endTime}
							onChange={t => changeEndTimeSlot(t)}
						/>
					</Container>
					<Container>
						<StyledInput
							label="제목"
							placeholder="새로운 일정"
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
			)
		}	
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
const TimeContainer = styled.div`
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
const StyledTimePicker = styled(TimePicker)`
	display: inline-block;
	width: 44%;
	margin-bottom: 10px;
	input {
		border-radius: 15px;
		height: 35px;
	}
`;
const StyledDateTimePicker = StyledTimePicker.withComponent(DateTimePicker);
const GridContainer = styled.div`
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
const GridHeader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	border-bottom: 1px solid #A4A7B5;
	color: #3C4043;
`;
const LabelContainer = styled.div`
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
const StyledInput = styled(Input)`
	width: 100%;
`;
const RadioInput = styled.input`
	display: none;
	&:checked + label {
		color: #3C4043;
	}
`;
const RadioLabel = styled.label`
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

export default SetTimeSlot;
