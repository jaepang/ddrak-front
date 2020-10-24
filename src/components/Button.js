/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const Button = ({ children, onClick }) => {
	return ( 
		<button css={style} onClick={onClick}>
			{ children }
		</button>
	);
};

const style = css `
	outline: none;
	border: none;
	box-sizing: border-box;
  	height: 2rem;
  	font-size: 0.875rem;
  	padding: 0.5rem 1rem;
	border-radius: 15px;
	background: #79A3F4;
	color: #FFF;
	&:focus {
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
	}
	&:hover {
		background: #5282E1;
	}

`

export default Button;
