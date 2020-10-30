import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { observer, inject } from 'mobx-react';
import LoginForm from './LoginForm';
import UserMenuButton from './UserMenuButton';
import { Modal, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';

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
            <div css={style}>
				{ this.page.loggedIn && <h3>{this.page.username}</h3> }
				{ !this.page.loggedIn && <h3>어서오세요!</h3> }
			<Modal 
				id="modal" 
				isOpen={this.page.openModal} 
				onRequestClose={this.page.handleCloseModal}
				css={modalStyle}
			>
				<LoginForm />
			</Modal>
			{ !this.page.loggedIn &&
				<UserMenuButton
					icon={<FontAwesomeIcon icon={faDoorOpen} size="3x"/>}
					label="로그인"
					onClick={this.page.handleOpenModal}
				/>
			}
			{ this.page.loggedIn &&
				<UserMenuButton
					icon={<FontAwesomeIcon icon={faDoorOpen} size="3x"/>}
					label="로그아웃"
					onClick={this.page.handleLogout}
				/>
			}
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

