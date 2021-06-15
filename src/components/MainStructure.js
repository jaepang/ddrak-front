import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { observer } from 'mobx-react';
import Header from './Header';
import Calendar from './Calendar';
import Sidebar from './Sidebar';

@observer
class MainStructure extends Component {
    render() {
        return (
            <div css={style}>
				<Sidebar />
				<div>
					<Header />
					<Calendar />
				</div>
			</div>
        );
    }
}

const style = css `
	margin: 0;
	padding: 1.5rem;
	display: grid;
	grid-template-columns: 1fr 3fr;
`;

export default MainStructure;

