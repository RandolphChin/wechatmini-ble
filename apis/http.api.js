// common/http.api.js

import * as user from './user.js';

// api 接口管理
const install = (Vue, vm) => {

	Vue.prototype.$api  = {
		// test get api
		getSearch: (params = {}) => vm.$u.get('/http/search', params),
		
		// modules import
		user
	};
}

export default {
	install
}
