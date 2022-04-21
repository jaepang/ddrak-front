import React from 'react';
import styled from '@emotion/styled';
import Header from './components/Header';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';

const App = () => {
    return (
        <Global>
            <Header />
			<Main>
				<Calendar />
				<Sidebar />
			</Main>
        </Global>
    );
}

const Global = styled.div`
	* { font-family: 'Spoqa Han Sans Neo', 'sans-serif'; }

	body {
			margin: 0 !important;
			padding: 0 !important;
			overflow: hidden;
			background-color: #FFF;
	}

	/** fullcalendar css */
	::-webkit-scrollbar {
		width: 0px;
		background: transparent;
	}
	.fc-scrollgrid {
		border: none !important;
	}
	.fc-scrollgrid td:last-of-type {
		border-right: none !important;
	}
	.fc-col-header {
		background-color: #F9F7FB;
	}
	.fc-col-header-cell-cushion {
		h2 {
			display: inline;
			font-size: 1.3rem;
			margin: 0.25rem auto;
			padding: 0.4rem;
			border-radius: 100%;

			font-weight: 400;
			text-align: center;
			line-height: 50px;
			letter-spacing: 2px;
		}
		p {
			display: inline;
			font-weight: 400;
			font-size: 1.2rem;
			margin: 0.4rem 0 auto;
		}
	}
	.fc-day-today h2 {
		background-color: #00A3DC !important;
		color: white;
	}
	.fc-timegrid-col.fc-day-today {
		background-color: #FFF !important;
	}
	.fc-timegrid-slot-label-cushion p {
		margin: 0 auto;
		font-size: 0.9rem;
		letter-spacing: -1px;
	}
	.fc-event-main-frame {
		padding-left: 0.7rem;
	}
	.fc-timegrid-event {
		border-radius: 15px;
		p {
			margin: 0.7rem 0 0.3rem 0;
			font-weight: 400;
			font-size: 0.8rem;
		}
	}
	.fc-event-title {
		margin-top: 0.1rem;
		font-weight: 500;
		font-size: 1rem;
	}
	/* overlapped event */
	.fc-timegrid-event-harness-inset {
		.fc-event-main-frame {
			padding-left: 0.4rem !important;
		}
		.fc-event-title {
			font-size: 0.9rem !important;
		}
		p {
			font-size: 0.5rem !important;
		}
	}
`;
const Main = styled.div`
	margin: 0;
	padding: 0;
	display: flex;
`;

export default App;
