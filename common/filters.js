import Vue from 'vue';
let vm = new Vue();

// 测试过滤器
export function x10Filter(val) {
	return val * 10;
}
