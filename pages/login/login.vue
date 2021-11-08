<template>
	<view class="container">
		<view class="intro">
			<image src="/static/logo.png"></image>
			<view class="tips">
				花开花落年年有
				<br>
				人世难得几回春
			</view>
		</view>
		
		<view class="bottom">
			<!-- #ifdef H5 -->
				<button type="primary" size="default" class="login-btn" @tap="h5Login">
					登录
				</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary"  @tap="getUserProfile"> 微信登录 </button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				navUrl: '',
				code: '',
				redirect: undefined
			}
		},
		methods: {
			getUserProfile() {
				let that = this;
				// 推荐使用uni.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (resp) => {
						//登录远程服务器
						if (that.code) {
							//登录远程服务器
							that.loginByWeixin(resp)
						} else {
							uni.login({
								success: function(resp) {
									if (resp.code) {
										that.code = resp.code
										that.loginByWeixin(resp)
									}
								}
							});
						}
					}
				})
			},
			loginByWeixin: function(userInfo) {
				let that = this;
				//登录远程服务器
				if (that.code) {
					this.$api.user.postUserLoginInfo({
						code: that.code,
						encryptedData: userInfo.encryptedData,
						errMsg: userInfo.errMsg,
						iv: userInfo.iv,
						rawData: userInfo.rawData,
						signature: userInfo.signature,
						userInfo: userInfo.userInfo
					}).then(res => {
						that.code = '';
						// 此处不需要校验code为200 请求拦截器中已判断
						this.$u.toast('获取数据成功');
						//存储用户信息
						this.$u.vuex('token', res.token)
						this.$u.vuex('userInfo', res.user.user)
						uni.setStorageSync('userInfo', res.user.user);
						uni.setStorageSync('token', res.token);
						
						uni.switchTab({
							url: that.navUrl
						})
					}).catch(err => {
						console.log(err)
						that.code = ''
					});
				}
			},
			h5Login(){
				console.log('yee haw')
			}
		},
		onLoad: function(options) {
			let that = this;
			if (uni.getStorageSync("navUrl")) {
				that.navUrl = uni.getStorageSync("navUrl")
			} else {
				that.navUrl = '/pages/login/login'
			}
			uni.login({
				success: function(res) {
					if (res.code) {
						that.code = res.code
					}
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
	.intro {
		width: 100%;
		height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		
		image {
			width: 165rpx;
			height: 165rpx;
		}
		
		.tips {
			line-height: 72rpx;
			text-align: center;
		}
	}
	
	.bottom {
		height: 40vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		
		.login-btn {
			width: 100%;
			border-radius: 50rem !important;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx 0;
			
			image {
				width: 36rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
		
	}
</style>
