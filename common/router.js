// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';

const router = createRouter({
	encodeURI: false,
	platform: process.env.VUE_APP_PLATFORM,
	routes: ROUTES
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if(!uni.getStorageSync('token')){
		uni.setStorageSync('navUrl',from.fullPath);
	}
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
})

export {
	router,
	RouterMount
}
