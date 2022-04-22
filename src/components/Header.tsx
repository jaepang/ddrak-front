import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../stores';
import { ButtonIcon, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Header = observer(() => {
	const { calendar, page } = useStore();
	const moveLeft = () => calendar.moveLeft();
	const moveRight = () => calendar.moveRight();
	const moveToday = () => calendar.moveToday();
	const switchCalendar = () => calendar.switchCalendar();

	const handleLogout = () => page.handleLogout();
	const openLoginModal = () => page.openLoginModal();

	return (
		<MainContainer>
			<LeftContainer>
				<Buttons>
					<LeftButtonIcon
						size="medium" 
						icon={<FontAwesomeIcon icon={faChevronLeft} />} 
						onClick={moveLeft}
						disabled={page.setCalendarMode && page.isSuper}
					/>
					<StyledButton
						shaded
						label="오늘"
						variant="border-filled"
						onClick={moveToday}
						disabled={page.setCalendarMode && page.isSuper}
					/>
					<RightButtonIcon
						size="medium" 
						icon={<FontAwesomeIcon icon={faChevronRight} />} 
						onClick={moveRight}
						disabled={page.setCalendarMode && page.isSuper}
					/>
				</Buttons>
				<h1>{calendar.headerDate}</h1>
			</LeftContainer>
			<RightContainer>
				{ (page.loggedIn && !page.isSuper) && 
					<SwitchCalendarButtons>
						<LeftButton
							shaded
							label="전체"
							variant="border-filled"
							onClick={switchCalendar}
							disabled={!calendar.clubCalendar || page.setCalendarMode}
						/>
						<RightButton
							shaded
							label="동아리"
							variant="border-filled"
							onClick={switchCalendar}
							disabled={calendar.clubCalendar || page.setCalendarMode}
						/>
					</SwitchCalendarButtons>
				}
				{ page.loggedIn ?
					<AuthButton
						shaded
						label="로그아웃"
						variant="border-filled"
						onClick={handleLogout}
					/>
				:
					<AuthButton
						shaded
						label="로그인"
						variant="border-filled"
						onClick={openLoginModal}
					/>
				}
			</RightContainer>
		</MainContainer>
	);
});

/** Container Styles */
const MainContainer = styled.div`
	padding: 1.5rem 1rem;
	display: flex;
    justify-content: space-between;
	h1 {
		color: #3C4043;
		margin: 0;
	}
	border-bottom: 1px solid #ddd;
`;
const SubContainer = styled.div`
	position: relative;
	height: 100%;
`;
const LeftContainer = styled(SubContainer)`
	flex: none;
	h1 {
		display: inline;
		transform: translateY(-50%);
	}
`;
const RightContainer = styled(SubContainer)`
	margin-left: auto;
`;

/** Button Styles */
const Buttons = styled.div`
	display: inline;
	vertical-align: top;
	margin-right: 1rem;
	transform: translateY(-50%);
`;
const SwitchCalendarButtons = styled.div`
	margin: auto 0;
	margin-right: 1rem;
	display: inline-block;
`;
const StyledButton = styled(Button)`
	color: #3C4043;
	background-color: #fff;
	border: 1px solid #ddd;
	height: 38px;
	box-shadow: 0 0 0 0;
	border-radius: 0;
	&:hover:enabled {
		background-color: #fafafa;
		color: #3C4043;
	}
`;
const RightButton = styled(StyledButton)`
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	margin-left: -1px;
`;
const RightButtonIcon = RightButton.withComponent(ButtonIcon);
const LeftButton = styled(StyledButton)`
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	margin-right: -1px;
`;
const LeftButtonIcon = LeftButton.withComponent(ButtonIcon);
const AuthButton = styled(StyledButton)`
	border-radius: 10px;
	float: right;
`;

export default Header;
