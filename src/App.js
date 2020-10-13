import React, { Component } from 'react';
import Calendar from './Calendar';

class App extends Component {
    state = {
        events: []
    };

    async componentDidMount() {
        try {
            const res = await fetch('http://34.71.74.93:8080/api/');
            const events = await res.json();
            this.setState({
                events
            });
			console.log(events);
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div>
                {this.state.events.map(item => (
                    <div key={item.id}>
                        <h1>{item.title}</h1>
						<span>{item.startDate}</span>
						<br/>
						<span>{item.endDate}</span>
                    </div>
                ))}
				<Calendar data={this.state.events}/>
			</div>
        );
    }
}

export default App;

