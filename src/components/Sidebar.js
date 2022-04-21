import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../stores';
import { Card, Calendar } from 'react-rainbow-components';
import UserMenu from './UserMenu';
import ExternalEvents from './ExternalEvents';
import SetTimeSlot from './SetTimeSlot';
import BorrowTimeSlot from './BorrowTimeSlot';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';

const Sidebar = observer(() => {
	const { calendar, page } = useStore();
	const currentDateChange = date => calendar.currentDateChange(date);
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const curYear = new Date().getFullYear();
	const minDate = new Date(curYear-5, 0, 1);
	const maxDate = new Date(curYear+5, 11, 31);
	
	return (
		<Container isMobile={isMobile}>
			<StyledCard>
				{ !page.setCalendarMode && 
					<Calendar 
						value={String(calendar.currentDate)}
						onChange={currentDateChange}
						minDate={minDate}
						maxDate={maxDate}
					/>
				}
				{ page.setCalendarMode &&
					<ExternalEvents />
				}
			</StyledCard>
			<StyledCard>
				{ page.setCalendarMode ?
					(page.borrowTimeMode ?
						<BorrowTimeSlot />:<SetTimeSlot />
					):
					<UserMenu />
				}
			</StyledCard>
		</Container>
	);
});

const Container = styled.div`
	margin: 0;
	padding: 1rem;
	border-left: 1px solid #ddd;
	background-color: #FCFCFC;
	width: 25%;
	height: auto;
	/*position: fixed;
	right: ${props => props.isMobile ? `` : `1rem`}*/
	display: ${props => props.isMobile ? `hidden` : `block`};
`
const StyledCard = styled(Card)`
	width: 100%;
	margin: 0;
	margin-bottom: 0.5rem;
	border: none;
	border-radius: 15px;
	box-shadow: 0px 0px 0px;
	&:hover {
		box-shadow: 0px 0px 0px;
	}
	h3 {
		margin-top: 0.225em;
	}
	background: transparent;
`

export default Sidebar;
