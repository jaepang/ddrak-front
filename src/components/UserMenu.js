import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { observer, inject } from 'mobx-react';
import LoginForm from './LoginForm';
import { Modal, Button } from 'react-rainbow-components';

@inject('calendar')
@observer
class UserMenu extends Component {
	calendar = this.props.calendar;
	
    render() {
        return (
            <div css={style}>
				{ this.calendar.username !== '' && <h3>{this.calendar.username}</h3> }
				{ this.calendar.username === '' && <h3>어서오세요!</h3> }
			<Modal 
				id="modal" 
				isOpen={this.calendar.openModal} 
				onRequestClose={this.calendar.handleCloseModal}
			>
				<LoginForm />
			</Modal>
			<Button
                id="button"
                variant=""
                label="Open Modal"
        		onClick={this.calendar.handleOpenModal}
            />
			</div>
        );
    }
}

const style = css `
`;

export default UserMenu;

