import { 
	faQuestion,
	faKey,
	faTools,
	faDoorOpen 
} from '@fortawesome/free-solid-svg-icons';
import {
	faCalendarAlt,
	faCalendarPlus,
	faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

const switchCalendar = { handler: 'switchCalendar', label: '시간표 전환', icon: faCalendarAlt };
const addEvent = { handler: 'openAddEventModal', label: '새 일정 추가', icon: faCalendarPlus };
const borrowRequest = { handler: 'openBorrowRequestModal', label: '대여 요청', icon: faPaperPlane };
const adminPage = { handler: 'adminPage', label: '관리자 페이지', icon: faTools };
const setCalendar = { handler: 'openSetCalendarModal', label: '시간표 등록', icon: faCalendarPlus };
const help = { handler: 'openHelpModal', label: '도움말', icon: faQuestion };
const changePassword = { handler: 'openChangePasswordModal', label: '비밀번호 변경', icon: faKey };
const login = { handler: 'openLoginModal', label: '로그인', icon: faDoorOpen };
const logout = { handler: 'handleLogout', label: '로그아웃', icon: faDoorOpen };

const clubType = {
	clubAdmin: [ switchCalendar, addEvent, borrowRequest, help, changePassword, logout ],
	club: [ switchCalendar, help, changePassword, logout ],
	admin: [ adminPage, setCalendar, changePassword, logout ],
	guest: [ login, borrowRequest, help]
}

export default clubType;
