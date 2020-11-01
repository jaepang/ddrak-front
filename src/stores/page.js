import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';
import LoginForm from '../components/forms/LoginForm';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class PageStore {
	@observable loggedIn = localStorage.getItem('token') ? true : false;
	@observable username = '';
	@observable usertype = 'guest';
	@observable isAdmin = false;
	@observable auth = {
		username: '',
		password: ''
	};

	@observable openModal = false;
	@observable modalContent = LoginForm;
	
	constructor(root) { 
		makeObservable(this);
		this.root = root; 
	}   

	@action
	handleFormChange = e => {
    	const name = e.target.name;
	    const value = e.target.value;
		this.auth[name] = value;
	}	
	
	@action
	handleLogin = (e) => {
		e.preventDefault();
		axios.post('/token-auth/', this.auth)
		.then(res => localStorage.setItem('token', res.data.token));
		this.loggedIn = true;
		this.username = this.auth.username.replace('admin',' 관리자');
		this.isAdmin = this.username !== this.auth.username;
		this.setUsertype(this.auth.username);
		this.auth.username = '';
		this.auth.password = '';
		this.openModal = false;
	}

	@action
	handleLogout = () => {
		localStorage.removeItem('token');
		this.loggedIn = false;
		this.username = '';
		this.usertype = 'guest';
		this.isAdmin = false;
	}

	getCurUser = flow(function*() {
		try {
			const res = yield axios.get('/api/current-user/', {
				headers: {
        	  		Authorization: `JWT ${localStorage.getItem('token')}`
        		}
			});
			const tmp = res.data.username;
			this.username = tmp.replace('admin', '관리자');
			this.isAdmin = this.username !== tmp;
			this.setUsertype(tmp);
		} catch(error) {
			if(error.response.status === 401) {
				localStorage.removeItem('token');
				this.loggedIn = false;
			}
		}
	})

	@action
	setUsertype = (username) => {
		if(this.isAdmin) {
			if(username === 'admin')
				this.usertype = 'admin';
			else
				this.usertype = 'clubAdmin';
		}
		else
			this.usertype = 'club';
	}

	@action
	handleOpenModal = () => this.openModal = true;
	@action
	handleCloseModal = () => this.openModal = false;

	@action
	handleOpenLoginModal = () => {
		this.modalContent = LoginForm;
		this.handleOpenModal();
	}
	adminPage = () => window.open('/admin');
}
