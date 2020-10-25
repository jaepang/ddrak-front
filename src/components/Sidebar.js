/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Card, Calendar } from 'react-rainbow-components';
import { observer, inject } from 'mobx-react';

const Sidebar = ({ date, onChange, children }) => {
	const curYear = new Date().getFullYear();
	const minDate = new Date(curYear-5, 0, 1);
	const maxDate = new Date(curYear+5, 11, 31);

	return (
		<div css={style}>
			<h1>화요뜨락</h1>
			<Card css={cardStyle}>
				<Calendar 
					value={date}
					onChange={onChange}
					minDate={minDate}
					maxDate={maxDate}
				/>
			</Card>
			<Card css={cardStyle}>
				{children}
			</Card>
		</div>
	);
};

const style = css `
	display: block;
	height: 100vh;
	padding: 1.5rem;
`
const cardStyle = css `
	width: 80%;
	padding: 1.5rem;
	margin: 0 auto;
	margin-bottom: 2rem;
	border: none;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
	&:hover {
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
	}
`

export default inject(({ calendar }) => ({
	date: calendar.currentDate,
	onChange: calendar.currentDateChange,
}))(observer(Sidebar));
