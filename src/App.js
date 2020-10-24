import React, { Component } from 'react';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import LoginForm from './components/LoginForm';
import './styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
				<Sidebar children={<LoginForm/>}/>
				<Calendar/>
			</div>
        );
    }
}

export default App;

