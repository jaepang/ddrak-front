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
			{children}
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
	border-radius: 15px;
`

export default inject(({ calendar }) => ({
	date: calendar.currentDate,
	onChange: calendar.currentDateChange,
}))(observer(Sidebar));
