<template>
	<view class="content">
		<view>
			<text>uview 引入测试:</text>
			<view>
				<u-tag text="一丘之貉" mode="dark" />
				<u-tag text="狼狈为奸" mode="plain" />
			</view>
		</view>

		<view>
			<text>iconfont 引入测试:</text>
			<view><cl-icon type="iconlaba" size="30" color="#999" @click="invoke()"></cl-icon></view>
		</view>

		<view>
			<text>router 引入测试:</text>
			<view>
				<u-button type="success" size="mini" @click="goHtml(1)">(params传参)富文本页面</u-button>
				<u-button type="success" size="mini" @click="goHtml(2)">(query传参)富文本页面</u-button>
				<u-button type="success" size="mini" @click="goHtml(3)">(h5)动态路由</u-button>
			</view>
			<text>
				更多路由跳转参考
				<a href="https://hhyang.cn/v2/start/cross/codeRoute.html">官方文档</a>
			</text>
		</view>

		<view>
			<text>接口请求 引入测试</text>

			<view>
				<u-button type="success" size="mini" @click="get">get请求</u-button>
				<u-button type="success" size="mini" @click="get1">get1请求</u-button>
				<u-button type="success" size="mini" @click="post">post请求</u-button>
			</view>
		</view>

		<view class="prompt">
			<text>1. 需在/common/config.js 中修改baseurl为自己服务器域名</text>
			<text>2. 需在/common/http.api.js 中定义自己的接口</text>
			<text>
				3. H5运行需要自己配置
				<a href="https://blog.csdn.net/weixin_39786582/article/details/109044896">本地代理</a>
			</text>
		</view>

		<view>
			<text>工具方法 引入测试</text>

			<view>
				<input v-model="toastMsg" type="text" placeholder="请输入消息" />
				<u-button type="success" size="mini" @click="toast">调用方法</u-button>
			</view>
		</view>

		<view>
			<text>全局过滤器 引入测试</text>
			<input v-model="testNum" type="number" placeholder="请输入数字" />
			<view>{{ testNum | x10Filter }}</view>
		</view>

		<view>
			<text>easycom组件 引入测试</text>
			<cl-test></cl-test>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			toastMsg: '',
			testNum: ''
		};
	},
	mounted() {
		// vuex 测试案例
		console.log('token:', this.token);
	},
	methods: {
		toast() {
			this.$t.toast(this.toastMsg);
		},
		goHtml(type) {
			if (type == 1) {
				this.$Router.push({
					name: 'richPage',
					params: {
						n1: 1,
						n2: 2
					}
				});
			} else if (type == 2) {
				this.$Router.push({
					path: '/pages/public/richPage/richPage',
					query: {
						plan: 'private'
					}
				});
			} else {
				this.$Router.push({
					name: 'newpage',
					params: {
						id: 1
					}
				});
			}
		},
		get() {
			this.$api.user.getUserInfo().then(res => {
				// 此处不需要校验code为200 请求拦截器中已判断
				this.$u.toast('获取数据成功');
				console.log('getUserInfo::', res);
			});
		},
		get1(){
			this.$api.getSearch({
				keyword:'111'
			}).then(res => {
				// 此处不需要校验code为200 请求拦截器中已判断
				this.$u.toast('获取数据成功');
				console.log('getSearch::', res);
			});
		},
		post() {
			this.$api.user.postGoodsInfo().then(res => {
				// 此处不需要校验code为200 请求拦截器中已判断
				this.$u.toast('获取数据成功');
				console.log('postGoodsInfo::', res);
			});
		},
		invoke() {
			console.log('yee haw')
		}
	}
};
</script>

<style lang="scss">
button + button {
	margin-left: 15rpx;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	height: 100vh;
	text-align: center;
	padding: 30rpx;

	> view:not([class='prompt']) {
		text:nth-of-type(1) {
			font-size: 38rpx;
			font-weight: bold;
		}
	}
}

.prompt {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 10px 30px;
	color: red;
	text-align: left;

	text + text {
		margin-top: 10rpx;
	}
}
</style>
