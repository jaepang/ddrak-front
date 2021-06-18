/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'react-rainbow-components';

@inject('page')
@observer
class ChangePasswordForm extends Component {

	page = this.props.page;

	render() {
    	return (
      		<form onSubmit={e => this.page.handlePasswordChange(e)}>
				<h2>비밀번호변경</h2>
		        <Input
	        		type="password"
		          	name="old"
					label="이전 비밀번호"
					labelAlignment="left"
					placeholder="password"
        		  	value={this.page.auth.old}
		          	onChange={this.page.handleFormChange}
					css={inputStyle}
        		/>
				<br/>
        		<Input
		          	type="password"
        		  	name="new"
					label="새 비밀번호"
					labelAlignment="left"
					placeholder="password"
		          	value={this.page.auth.new}
        		 	onChange={this.page.handleFormChange}
					css={inputStyle}
		        />
        		<Button
					label="비밀번호 변경"
					type="submit"
					variant="brand"
					css={buttonStyle}
				/>
	      </form>
    	);
  	}
}

const inputStyle = css `
	input {
		border-radius: 15px;
	}
	label {
		margin-left: 5px;
	}
`;
const buttonStyle = css `
	margin-top: 1.2rem;
	border-radius: 15px;
`;

export default ChangePasswordForm;

