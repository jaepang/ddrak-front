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
            <div>
				<Header />
				<div css={style}>
					<Calendar />
					<Sidebar />
				</div>
			</div>
        );
    }
}

const style = css `
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: 3fr 1fr;
`;

export default MainStructure;

