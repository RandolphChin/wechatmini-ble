// common/http.interceptor.js

import config from '@/common/config.js';

const install = (Vue, vm) => {
	
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: config.baseUrl,
		loadingText: '努力加载中~',
		loadingTime: 1000,
		originalData:true,
		// 设置自定义头部content-type
		// header: {
		// 	'content-type': 'xxx'
		// }
		// ......
	});

	// 请求拦截部分，如配置，每次请求前都会执行
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// 引用token
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
		// 见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;

		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;

		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;

		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
		// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		config.header.Authorization = vm.$store.state.token
		// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		if (config.url == '/auth/wechatLogin') config.header.noToken = true;
		// 最后需要将config进行return
		return config;
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求
	}

	// 响应拦截，如配置，每次请求结束都会执行本方法
	Vue.prototype.$u.http.interceptor.response = (res) => {
		
		// 返回成功
		if(res.statusCode == 200){
				return res.data;
		}else{
			if(res.statusCode == 401){
				uni.removeStorageSync('navUrl')
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('token')
				Vue.prototype.$u.vuex('token', '')
				uni.redirectTo({
					url: '/pages/login/login',
				})
			}else{
				vm.$u.toast('接口请求失败!');
			}
		}
		
		return false;
	}
}

export default {
	install
}
