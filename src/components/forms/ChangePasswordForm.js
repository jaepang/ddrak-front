import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../stores';
import { Input, Button } from 'react-rainbow-components';
import styled from '@emotion/styled';

const ChangePasswordForm = observer(() => {
	const { page } = useStore();
    return (
		<form onSubmit={e => page.handlePasswordChange(e)}>
			<h2>비밀번호변경</h2>
			<StyledInput
				type="password"
				name="old"
				label="이전 비밀번호"
				labelAlignment="left"
				placeholder="password"
				value={page.auth.old}
				onChange={page.handleFormChange}
			/>
			<br/>
			<StyledInput
				type="password"
				name="new"
				label="새 비밀번호"
				labelAlignment="left"
				placeholder="password"
				value={page.auth.new}
				onChange={page.handleFormChange}
			/>
			<StyledButton
				label="비밀번호 변경"
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

export default ChangePasswordForm;
