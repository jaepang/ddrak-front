import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { observer, inject } from 'mobx-react';
import UserMenuButton from './UserMenuButton';
import { Modal, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clubType from '../utils/userMenuButtonContent';

@inject('page')
@observer
class UserMenu extends Component {
	page = this.props.page;
	
	componentDidMount() {
		if(this.page.loggedIn) {
			this.page.getCurUser();
		}
	}

	componentDidUpdate() {
		if(this.page.loggedIn) {
			this.page.getCurUser();
		}
	}

    render() {
        return (
            <div>
				{ this.page.loggedIn && <h3>{this.page.usernameDisplay}</h3> }
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
				{ (this.page.isAdmin && !this.page.setCalendarMode) &&
					<Button
						label="변경사항 적용"
						variant="brand"
						css={submitButtonStyle}
						disabled={this.page.root.calendar.disableSubmitButton}
						onClick={this.page.root.calendar.submitData}
					/>
				}
				{ (this.page.isAdmin && this.page.setCalendarMode) &&
					<div css={setTimeMode}>
						<Button
							label="적용"
							variant="brand"
							css={buttonStyle}
							disabled={this.page.root.calendar.disableSubmitButton}
							onClick={this.page.root.calendar.submitData}
						/>
						<Button
							label="취소"
							variant="destructive"
							css={buttonStyle}
							onClick={this.page.disableSetCalendarMode}
						/>
					</div>
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
const setTimeMode = css `
	display: flex;
	justify-content: space-between;
`;
const buttonStyle = css `
	display: inline-block;
	border-radius: 15px;
	width: 48%;
	margin-top: 10px;
`;

export default UserMenu;

