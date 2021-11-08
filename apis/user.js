// test user request api
import Vue from 'vue';
let vm = new Vue();

// test get api
export function getUserInfo(params){
	return vm.$u.get('/auth/wechatLogin', params)
}

// test post api
export function postUserLoginInfo(params){
	return vm.$u.post('/auth/wechatLogin', params)
}

export function getWechatUserList(params){
	return vm.$u.get('/api/wechat', params)
}