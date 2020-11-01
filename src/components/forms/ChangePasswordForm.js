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
      		<form onSubmit={e => this.page.handleLogin(e)}>
				<h4>비밀번호변경</h4>
		        <Input
	        		type="text"
		          	name="username"
					label="Username"
					labelAlignment="left"
					placeholder="username"
        		  	value={this.page.auth.username}
		          	onChange={this.page.handleFormChange}
					css={inputStyle}
        		/>
				<br/>
        		<Input
		          	type="password"
        		  	name="password"
					label="Password"
					labelAlignment="left"
					placeholder="password"
		          	value={this.page.auth.password}
        		 	onChange={this.page.handleFormChange}
					css={inputStyle}
		        />
        		<Button
					label="login"
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
		margin-left: -10px;
	}
`;
const buttonStyle = css `
	border-radius: 15px;
`;

export default ChangePasswordForm;

