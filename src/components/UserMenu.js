import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { useStore } from '../stores';
import UserMenuButton from './UserMenuButton';
import { Modal, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clubType from '../utils/userMenuButtonContent';
import styled from '@emotion/styled';

const UserMenu = observer(() => {
	const { calendar, page } = useStore();
	const submitData = () => calendar.submitData();
	const disableSetCalendarMode = () => page.disableSetCalendarMode();

	useEffect(() => autorun(() => {
		if(page.loggedIn) {
			page.getCurUser();
		}
	}));

    return (
		<div>
			{ page.loggedIn && <h3>{page.usernameDisplay}</h3> }
			{ !page.loggedIn && <h3>어서오세요!</h3> }
			<StyledModal 
				id="modal" 
				isOpen={page.openModal} 
				onRequestClose={page.handleCloseModal}
			>
				{<page.modalContent/>} 
			</StyledModal>
			<Container>
				{clubType[page.usertype].map( b => (
						<UserMenuButton
							key={b.label}
							icon={<FontAwesomeIcon icon={b.icon} size="3x"/>}
							label={b.label}
							onClick={page[b.handler]}
						/>
					))
				}
			</Container>
			{ (page.isAdmin && !page.setCalendarMode) &&
				<SubmitButton
					label="변경사항 적용"
					variant="brand"
					disabled={calendar.disableSubmitButton}
					onClick={submitData}
				/>
			}
			{ (page.isAdmin && page.setCalendarMode) &&
				<SetCalendarContainer>
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
				</SetCalendarContainer>
			}
		</div>
	 );
});

const Container = styled.div`
	margin: 7% auto 12% auto;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(30%, auto));
	column-gap: 3%;
	row-gap: 20%;
`;
const StyledModal = styled(Modal)`
	padding: 1.5rem;
`;
const SubmitButton = styled(Button)`
	display: block;
	border-radius: 15px;
	width: 100%;
	margin-top: 10px;
`;
const SetCalendarContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;
const StyledButton = styled(Button)`
	display: inline-block;
	border-radius: 15px;
	width: 48%;
	margin-top: 10px;
`;

export default UserMenu;

