import { makeObservable, observable, flow } from 'mobx';
import axios from 'axios';

export default class Events {
	@observable data = [];
	
	constructor() {
		makeObservable(this);
	}

	fetchEvents = flow(function*() {
    	const res = yield axios.get('http://34.71.74.93:8080/api');
    	this.data = res.data;
    })
}
