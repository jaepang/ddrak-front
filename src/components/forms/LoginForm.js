/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'react-rainbow-components';

@inject('page')
@observer
class LoginForm extends Component {

	page = this.props.page;

	render() {
    	return (
      		<form onSubmit={e => this.page.handleLogin(e)}>
				<h2>로그인</h2>
		        <Input
	        		type="text"
		          	name="username"
					label="계정명"
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
					label="비밀번호"
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
		margin-left: 5px;
	}
`;
const buttonStyle = css `
	margin-top: 1.2rem;
	border-radius: 15px;
`;

export default LoginForm;

