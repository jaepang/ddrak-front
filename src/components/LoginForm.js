import React from 'react';
import { observer, inject } from 'mobx-react';

@inject('calendar')
@observer
class LoginForm extends React.Component {

	calendar = this.props.calendar;

	render() {
    	return (
      		<form onSubmit={e => this.calendar.handleLogin(e)}>
				<h4>로그인</h4>
        		<label htmlFor="username">Username</label>
		        <input
        		  type="text"
		          name="username"
        		  value={this.calendar.auth.username}
		          onChange={this.calendar.handleFormChange}
        		/>
				<br/>
		        <label htmlFor="password">Password</label>
        		<input
		          type="password"
        		  name="password"
		          value={this.calendar.auth.password}
        		  onChange={this.calendar.handleFormChange}
		        />
        		<button type="submit">submit</button>
	      </form>
    	);
  	}
}

export default LoginForm;

