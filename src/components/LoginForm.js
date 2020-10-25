/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'react-rainbow-components';

@inject('calendar')
@observer
class LoginForm extends React.Component {

	calendar = this.props.calendar;

	render() {
    	return (
      		<form onSubmit={e => this.calendar.handleLogin(e)}>
				<h4>로그인</h4>
		        <Input
	        		type="text"
		          	name="username"
					label="Username"
					labelAlignment="left"
					placeholder="username"
        		  	value={this.calendar.auth.username}
		          	onChange={this.calendar.handleFormChange}
					css={inputStyle}
        		/>
				<br/>
        		<Input
		          	type="password"
        		  	name="password"
					label="Password"
					labelAlignment="left"
					placeholder="password"
		          	value={this.calendar.auth.password}
        		 	onChange={this.calendar.handleFormChange}
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

export default LoginForm;

