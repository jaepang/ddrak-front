/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const UserMenuButton = ({icon, label, onClick}) => {
	return (
		<button css={style} onClick={onClick}>
			{icon}
			{label}
		</button>
	)
}

const style = css `
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
