import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../stores';
import { Input, Button } from 'react-rainbow-components';
import styled from '@emotion/styled';

const LoginForm = observer(() => {
	const { page } = useStore();
	const handleLogin = e => page.handleLogin(e);
	const handleFormChange = e => page.handleFormChange(e);
    return (
		<form onSubmit={e => handleLogin(e)}>
			<h2>로그인</h2>
			<StyledInput
				type="text"
				name="username"
				label="계정명"
				labelAlignment="left"
				placeholder="username"
				value={page.auth.username}
				onChange={handleFormChange}
			/>
			<br/>
			<StyledInput
				type="password"
				name="password"
				label="비밀번호"
				labelAlignment="left"
				placeholder="password"
				value={page.auth.password}
				onChange={handleFormChange}
			/>
			<StyledButton
				label="login"
				type="submit"
				variant="brand"
			/>
		</form>
	);
});

const StyledInput = styled(Input)`
	input {
		border-radius: 15px;
	}
	label {
		margin-left: 5px;
	}
`;
const StyledButton = styled(Button)`
	margin-top: 1.2rem;
	border-radius: 15px;
`;

export default LoginForm;

