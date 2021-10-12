import { 
	faKey,
	faQuestion,
	faShare,
	faTools,
	faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import {
	faCalendarPlus,
	faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

//const addEvent = { handler: 'openAddEventModal', label: '새 일정 추가', icon: faCalendarPlus };
const adminPage = { handler: 'adminPage', label: '관리자 페이지', icon: faTools };
const borrowRequest = { handler: 'openBorrowRequestModal', label: '대여 요청', icon: faPaperPlane };
const borrowSubmit = { handler: 'enableBorrowTimeMode', label: '대여 등록', icon: faShare };
const login = { handler: 'openLoginModal', label: '로그인', icon: faSignInAlt}
const changePassword = { handler: 'openChangePasswordModal', label: '비밀번호 변경', icon: faKey };
const help = { handler: 'openHelpModal', label: '도움말', icon: faQuestion };
const setCalendar = { handler: 'enableSetCalendarMode', label: '시간표 등록', icon: faCalendarPlus };

const clubType = {
	clubAdmin: [ setCalendar, borrowSubmit, borrowRequest, help, changePassword ],
	club: [ help, changePassword],
	admin: [ adminPage, setCalendar, changePassword],
	guest: [ login, borrowRequest, help ]
};

export default clubType;
