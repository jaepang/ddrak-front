import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { observer, inject } from 'mobx-react';
import LoginForm from './LoginForm';
import { Modal, Button } from 'react-rainbow-components';

@inject('page')
@observer
class UserMenu extends Component {
	page = this.props.page;
	
    render() {
        return (
            <div css={style}>
				{ this.page.username !== '' && <h3>{this.page.username}</h3> }
				{ this.page.username === '' && <h3>어서오세요!</h3> }
			<Modal 
				id="modal" 
				isOpen={this.page.openModal} 
				onRequestClose={this.page.handleCloseModal}
				css={modalStyle}
			>
				<LoginForm />
			</Modal>
			<Button
                id="button"
                variant="brand"
                label="Open Modal"
        		onClick={this.page.handleOpenModal}
            />
			</div>
        );
    }
}

const style = css `
`;
const modalStyle = css `
	padding: 1.5rem;
`;

export default UserMenu;

