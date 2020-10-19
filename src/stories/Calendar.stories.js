import React from 'react';
import Calendar from '../components/Calendar';

export default {
	title: 'components| BUG/Calendar',
	component: Calendar
};

export const standard = () => <Calendar name="test"/>;
export const big = () => <Calendar name="test big" big />;
