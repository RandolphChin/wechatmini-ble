const install = (Vue, vm) => {
	
	Vue.prototype.$t = {
		// 测试toast
		toast(msg){
			vm.$u.toast(msg);
		}
	}
	
}

export default {
	install
}
