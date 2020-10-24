/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const Sidebar = ({ children }) => {
	return (
		<div css={style}>
			<h1>화요뜨락</h1>
			{children}
		</div>
	);
};

const style = css `
	display: block;
	height: 100vh;
	width: 30%;
	position: fixed;
	top: 0;
	left: 0;
`

export default Sidebar;
