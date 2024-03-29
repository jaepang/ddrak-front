import { makeObservable, observable, action, flow } from 'mobx';
import axios from 'axios';
import { LoginForm, ChangePasswordForm } from '../components/forms';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class PageStore {
	@observable loggedIn = localStorage.getItem('token') ? true : false;
	@observable username = '';
	@observable usernameDisplay = '';
	@observable usertype = 'guest';
	@observable userclub = 'none';
	@observable isAdmin = false;
	@observable isSuper = false;
	@observable auth = {
		username: '',
		password: '',
		old: '',
		new: ''
	};
	@observable openModal = false;
	@observable modalContent = LoginForm;
	@observable setCalendarMode = false;
	@observable borrowTimeMode = false;
	
	constructor(root) { 
		makeObservable(this);
		this.root = root; 
	}

	@action
	handleFormChange = (e) => {
    	const name = e.target.name;
	    const value = e.target.value;
		this.auth[name] = value;
	}	
	
	@action
	handleLogin = (e) => {
		e.preventDefault();
		const req = {
			username: this.auth.username,
			password: this.auth.password
		};
		axios.post('/token-auth/', req)
		.then(action((res) => {
			if(res.status === 200) {
				localStorage.setItem('token', res.data.token);
				this.loggedIn = true;
				this.username = this.auth.username;
				this.usernameDisplay = this.username.replace('admin',' 관리자');
				this.isAdmin = res.data.is_staff;
				this.isSuper = res.data.is_superuser;
				this.setUsertype();
				this.setUserclub(this.username, this.usertype);
				this.auth.username = '';
				this.auth.password = '';
				this.openModal = false;
				this.getCurUser();
				this.root.calendar.getData();
			}
		}))
		.catch(e => alert("로그인 실패"));
	}

	@action
	handleLogout = () => {
		localStorage.removeItem('token');
		this.loggedIn = false;
		this.username = '';
		this.usernameDisplay = '';
		this.usertype = 'guest';
		this.userclub = 'none';
		this.isAdmin = false;
		this.setCalendarMode = false;
		this.borrowTimeMode = false;
		this.root.calendar.getData();
	}

	getCurUser = flow(function*() {
		try {
			const res = yield axios.get('/api/current-user/', {
				headers: {
        	  		Authorization: `JWT ${localStorage.getItem('token')}`
        		}
			});
			this.username = res.data.username;
			this.usernameDisplay = this.username.replace('admin', '관리자');
			this.isAdmin = res.data.is_staff;
			this.isSuper = res.data.is_superuser;
			this.setUsertype();
			this.setUserclub(this.username, this.usertype);
		} catch(error) {
			if(error.response.status === 401) {
				localStorage.removeItem('token');
				this.loggedIn = false;
			}
		}
	})

	@action
	handlePasswordChange = (e) => {
		e.preventDefault();
		const req = {
			old_password: this.auth.old,
			new_password: this.auth.new
		};
		axios.patch('/api/update-password/', req, {
			headers: {
        		Authorization: `JWT ${localStorage.getItem('token')}`
        	}
		})
		.then(action((res) => {
			alert("비밀번호 변경 성공!")
			this.auth.old = '';
			this.auth.new = '';
			this.openModal = false;
		}))
		.catch( e => alert("다시 시도해 주세요."));
	}

	@action
	setUsertype = () => {
		if(this.isSuper)
			this.usertype = 'admin';
		else if(this.isAdmin)
			this.usertype = 'clubAdmin';
		else
			this.usertype = 'club';
	}

	@action
	setUserclub = (username, usertype) => {
		if(usertype === 'club')
			this.userclub = username;
		else if(usertype === 'clubAdmin')
			this.userclub = username.substring(0, username.length-5);
	}

	@action
	handleOpenModal = () => this.openModal = true;
	@action
	handleCloseModal = () => this.openModal = false;

	@action
	openLoginModal = () => {
		this.modalContent = LoginForm;
		this.handleOpenModal();
	}
	@action
	openChangePasswordModal = () => {
		this.modalContent = ChangePasswordForm;
		this.handleOpenModal();
	}
	@action
	enableSetCalendarMode = () => {
		this.setCalendarMode = true;
		this.root.calendar.enableSetCalendarMode();
	}
	@action
	disableSetCalendarMode = () => {
		this.setCalendarMode = false;
		this.root.calendar.disableSetCalendarMode();
	}
	@action
	enableBorrowTimeMode = () => {
		this.borrowTimeMode = true;
		this.enableSetCalendarMode();
	}
	@action
	disableBorrowTimeMode = () => {
		this.borrowTimeMode = false;
		this.disableSetCalendarMode();
	}
	
	adminPage = () => window.open('/admin');

	@action
	switchCalendar = () => {
		this.root.calendar.switchCalendar();
	}
}
