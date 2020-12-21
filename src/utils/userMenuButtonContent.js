import { 
	faDoorOpen,
	faKey,
	faQuestion,
	faTools,
} from '@fortawesome/free-solid-svg-icons';
import {
	faCalendarAlt,
	faCalendarPlus,
	faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

//const addEvent = { handler: 'openAddEventModal', label: '새 일정 추가', icon: faCalendarPlus };
const adminPage = { handler: 'adminPage', label: '관리자 페이지', icon: faTools };
const borrowRequest = { handler: 'openBorrowRequestModal', label: '대여 요청', icon: faPaperPlane };
const changePassword = { handler: 'openChangePasswordModal', label: '비밀번호 변경', icon: faKey };
const help = { handler: 'openHelpModal', label: '도움말', icon: faQuestion };
const login = { handler: 'openLoginModal', label: '로그인', icon: faDoorOpen };
const logout = { handler: 'handleLogout', label: '로그아웃', icon: faDoorOpen };
const setCalendar = { handler: 'enableSetCalendarMode', label: '시간표 등록', icon: faCalendarPlus };
const switchCalendar = { handler: 'switchCalendar', label: '시간표 전환', icon: faCalendarAlt };

const clubType = {
	clubAdmin: [ switchCalendar, setCalendar, borrowRequest, help, changePassword, logout ],
	club: [ switchCalendar, help, changePassword, logout ],
	admin: [ adminPage, setCalendar, changePassword, logout ],
	guest: [ login, borrowRequest, help]
};

export default clubType;
