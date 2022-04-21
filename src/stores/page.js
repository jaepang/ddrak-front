import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { LoginForm, ChangePasswordForm } from '../components/forms';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class PageStore {
	loggedIn = localStorage.getItem('token') ? true : false;
	username = '';
	usernameDisplay = '';
	usertype = 'guest';
	userclub = 'none';
	otherclubs = [];
	isAdmin = false;
	isSuper = false;
	auth = {
		username: '',
		password: '',
		old: '',
		new: ''
	};
	openModal = false;
	modalContent = LoginForm;
	setCalendarMode = false;
	borrowTimeMode = false;
	
	constructor(root) { 
		this.root = root;
		makeAutoObservable(this);
	}

	handleFormChange = e => {
    	const name = e.target.name;
	    const value = e.target.value;
		this.auth[name] = value;
	}	
	
	handleLogin = async (e) => {
		e.preventDefault();
		const req = {
			username: this.auth.username,
			password: this.auth.password
		};
		try {
			const res = await axios.post('/token-auth/', req);
			if(res.status === 200) {
				localStorage.setItem('token', res.data.token);
				runInAction(() => {
					this.loggedIn = true;
					this.username = this.auth.username;
					this.usernameDisplay = this.username.replace('admin', ' 관리자');
					this.isAdmin = res.data.is_staff;
					this.isSuper = res.data.is_superuser;
					this.setUsertype();
					this.setUserclub(this.username, this.usertype);
					this.auth.username = '';
					this.auth.password = '';
					this.openModal = false;
					this.getCurUser();
					this.root.calendar.getData();
				})
			}
		} catch(error) {
			alert("로그인 실패");
		}
	}

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

	getCurUser = async () => {
		try {
			const res = await axios.get('/api/current-user/', {
				headers: {
        	  		Authorization: `JWT ${localStorage.getItem('token')}`
        		}
			});
			runInAction(() => {
				this.username = res.data.username;
				this.usernameDisplay = this.username.replace('admin', '관리자');
				this.isAdmin = res.data.is_staff;
				this.isSuper = res.data.is_superuser;
				this.setUsertype();
				this.setUserclub(this.username, this.usertype);
			});
		} catch(error) {
			if(error.response.status === 401) {
				localStorage.removeItem('token');
				runInAction(() => this.loggedIn = false);
			}
		}
	}

	handlePasswordChange = async (e) => {
		e.preventDefault();
		const req = {
			old_password: this.auth.old,
			new_password: this.auth.new
		};
		try {
			await axios.patch('/api/update-password/', req, {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`
				}
			});
			runInAction(() => {
				alert("비밀번호 변경 성공!")
				this.auth.old = '';
				this.auth.new = '';
				this.openModal = false;
			})
		} catch(error) {
			alert("다시 시도해 주세요.")
		}
	}

	setUsertype = () => {
		if(this.isSuper)
			this.usertype = 'admin';
		else if(this.isAdmin)
			this.usertype = 'clubAdmin';
		else
			this.usertype = 'club';
	}

	setUserclub = (username, usertype) => {
		const clubs = ['악의꽃', '막무간애', '모여락']
		if(usertype === 'club')
			this.userclub = username;
		else if(usertype === 'clubAdmin')
			this.userclub = username.substring(0, username.length-5);
		if(this.userclub !== 'none')
			this.otherclubs = clubs.filter(c => c !== this.userclub);
	}

	handleOpenModal = () => this.openModal = true;
	handleCloseModal = () => this.openModal = false;

	openLoginModal = () => {
		this.modalContent = LoginForm;
		this.handleOpenModal();
	}
	openChangePasswordModal = () => {
		this.modalContent = ChangePasswordForm;
		this.handleOpenModal();
	}

	enableSetCalendarMode = () => {
		this.setCalendarMode = true;
		this.root.calendar.enableSetCalendarMode();
	}
	
	disableSetCalendarMode = () => {
		this.setCalendarMode = false;
		this.root.calendar.disableSetCalendarMode();
	}
	
	enableBorrowTimeMode = () => {
		this.borrowTimeMode = true;
		this.enableSetCalendarMode();
	}
	
	disableBorrowTimeMode = () => {
		this.borrowTimeMode = false;
		this.disableSetCalendarMode();
	}
	
	adminPage = () => window.open('/admin');

	switchCalendar = () => {
		this.root.calendar.switchCalendar();
	}
}
