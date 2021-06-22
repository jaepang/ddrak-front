import { 
	faKey,
	faQuestion,
	faTools,
} from '@fortawesome/free-solid-svg-icons';
import {
	faCalendarPlus,
	faPaperPlane
} from '@fortawesome/free-regular-svg-icons';

//const addEvent = { handler: 'openAddEventModal', label: '새 일정 추가', icon: faCalendarPlus };
const adminPage = { handler: 'adminPage', label: '관리자 페이지', icon: faTools };
const borrowRequest = { handler: 'openBorrowRequestModal', label: '대여 요청', icon: faPaperPlane };
const changePassword = { handler: 'openChangePasswordModal', label: '비밀번호 변경', icon: faKey };
const help = { handler: 'openHelpModal', label: '도움말', icon: faQuestion };
const setCalendar = { handler: 'enableSetCalendarMode', label: '시간표 등록', icon: faCalendarPlus };

const clubType = {
	clubAdmin: [ setCalendar, borrowRequest, help, changePassword ],
	club: [ help, changePassword],
	admin: [ adminPage, setCalendar, changePassword],
	guest: [ borrowRequest, help]
};

export default clubType;
