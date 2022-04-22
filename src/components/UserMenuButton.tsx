import React from 'react';
import styled from '@emotion/styled';

const UserMenuButton = ({icon, label, onClick}) => {
	return (
		<Button onClick={onClick}>
			{icon}
			{label}
		</Button>
	)
}

const Button = styled.button`
	cursor: pointer;
	border: none;
	background: transparent;
	color: #3C4043;
	width: 100%;
	height: 100%;
	padding: 0;
	svg {
		display: block;
	    margin: 0 auto;
		margin-bottom: 10px;
	}
`;

export default UserMenuButton;
