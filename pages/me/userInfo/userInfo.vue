<template>
	<view>
		<view>
			<u-avatar :src="userInfo.avatar"></u-avatar>
			<view>{{userInfo.nickname}}</view>			
		</view>
		<view v-for="(item, index) in wechatUserList">
			<u-card :title="item.nickname" :sub-title="item.openid" >
				<view class="" slot="body">
					<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
						<view class="u-body-item-title u-line-2">海葵科教</view>
						<image :src="item.avatar" mode="aspectFill"></image>
					</view>
				</view>
				<view class="" slot="foot"><u-icon name="chat-fill" size="34" color="" label="30评论"></u-icon></view>
			</u-card>
			
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				wechatUserList: [],
				status: 'loadmore', // 加载前值为loadmore，加载中为loading，没有数据为nomore
				page: 0,
				size: 5
			}
		},
		methods: {
			getWechatUserList(){
				let that = this;
				this.status = 'loading'
				this.$api.user.getWechatUserList({}).then(res => {
					// this.page = this.page + 1
					// if(res.content.length > 0){
					// 	this.status = 'loadmore'
					// 	that.wechatUserList = that.wechatUserList.concat(res.content)
					// }else{
					// 	this.status = 'nomore'
					// }
					
					
					this.status = 'nomore'
				})
			}
		},
		onShow() {
			this.getWechatUserList()
		},
		onLoad() {
			let that = this;
			that.userInfo = uni.getStorageSync('userInfo');
			uni.checkSession().then(res => {
				console.log(res)
			})
		},
		beforeDestroy() {
			this.page = 0
		}
	}
</script>

<style>

</style>
