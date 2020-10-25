import { Component } from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Calendar from './Calendar';
import Sidebar from './Sidebar';
import LoginForm from './LoginForm';

class MainStructure extends Component {
    render() {
        return (
            <div css={style}>
				<Sidebar children={<LoginForm/>}/>
				<Calendar/>
			</div>
        );
    }
}

const style = css `
	margin: 0;
	display: grid;
	grid-template-columns: 1fr 3fr;
`;

export default MainStructure;

