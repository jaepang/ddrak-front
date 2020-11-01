import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { observer, inject } from 'mobx-react';
import UserMenuButton from './UserMenuButton';
import { Modal, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faQuestion,
	faKey,
	faTools,
	faDoorOpen 
} from '@fortawesome/free-solid-svg-icons';
import {
	faCalendarAlt,
	faCalendarPlus,
	faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

const switchCalendar = { handler: 'switchCalendar', label: '시간표 전환', icon: faCalendarAlt };
const addEvent = { handler: 'openAddEventModal', label: '새 일정 추가', icon: faCalendarPlus };
const borrowRequest = { handler: 'openBorrowRequestModal', label: '대여 요청', icon: faPaperPlane };
const adminPage = { handler: 'adminPage', label: '관리자 페이지', icon: faTools };
const setCalendar = { handler: 'openSetCalendarModal', label: '시간표 등록', icon: faCalendarPlus };
const help = { handler: 'openHelpModal', label: '도움말', icon: faQuestion };
const changePassword = { handler: 'openChangePasswordModal', label: '비밀번호 변경', icon: faKey };
const login = { handler: 'openLoginModal', label: '로그인', icon: faDoorOpen };
const logout = { handler: 'handleLogout', label: '로그아웃', icon: faDoorOpen };

const clubType = {
	clubAdmin: [ switchCalendar, addEvent, borrowRequest, help, changePassword, logout ],
	club: [ switchCalendar, help, changePassword, logout ],
	admin: [ adminPage, setCalendar, changePassword, logout ],
	guest: [ login, borrowRequest, help]
}

@inject('page')
@observer
class UserMenu extends Component {
	page = this.props.page;
	
	componentDidMount() {
		if(this.page.loggedIn) {
			this.page.getCurUser();
		}
	}

    render() {
        return (
            <div>
				{ this.page.loggedIn && <h3>{this.page.username}</h3> }
				{ !this.page.loggedIn && <h3>어서오세요!</h3> }
				<Modal 
					id="modal" 
					isOpen={this.page.openModal} 
					onRequestClose={this.page.handleCloseModal}
					css={modalStyle}
				>
					{<this.page.modalContent/>} 
				</Modal>
				<div css={style}>
					{clubType[this.page.usertype].map( b => (
							<UserMenuButton
								key={b.label}
								icon={<FontAwesomeIcon icon={b.icon} size="3x"/>}
								label={b.label}
								onClick={this.page[b.handler]}
							/>
						))
					}
				</div>
				{ this.page.isAdmin &&
					<Button
						label="변경사항 적용"
						variant="brand"
						css={submitButtonStyle}
						disabled={this.page.root.calendar.disableSubmitButton}
						onClick={this.page.root.calendar.submitData}
					/>
				}
			</div>
        );
    }
}

const style = css `
	margin: 10% auto 15% auto;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(30%, auto));
	column-gap: 3%;
	row-gap: 20%;
`;
const modalStyle = css `
	padding: 1.5rem;
`;
const submitButtonStyle = css `
	display: block;
	border-radius: 15px;
	width: 100%;
	margin-top: 10px;
`;

export default UserMenu;

