import React, { Component } from 'react';
import MainStructure from './components/MainStructure';
import { Global, css } from '@emotion/core';
//import './styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <Global styles={globalStyle}/>
			    <MainStructure/>
            </div>
        );
    }
}

const globalStyle = css `
    * { font-family: 'Spoqa Han Sans Neo', 'sans-serif'; }

    body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden;
        background-color: #FFF;
    }
`;

export default App;

