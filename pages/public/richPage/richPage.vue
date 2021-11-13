<template>
	<view>
		<view>
		<u-card :head-border-bottom="false" :show-head="false" @body-click="buildConnect()">
			<view slot="body">
				<view class="u-flex u-row-between">
					<view class="u-line-2">
						<view class="u-flex u-row-left">
							<view class="u-font-xl">{{ query.name}}</view>
							<view :class="'conn-state-' + state ">{{ connState[state]}}</view>
						</view>
						<view class="u-flex u-row-between u-m-t-20">
							<view class="dev-signal">信号:{{query.rssi}}</view>
							<view class="u-m-l-20">DeviceId:</view>
							<view class="u-m-l-20">{{ query.deviceId }}</view>
						</view>
					</view>
				</view>
			</view>
		</u-card>
		</view>
		<view class="u-flex u-row-between u-p-l-30 u-p-r-30">
			<view class="service-style">{{ serviceId }}</view>
			<view><u-button shape="square" size="mini" type="error" @click="goBack()">返回</u-button></view>
		</view>
		<view class="u-flex u-row-between u-p-l-30 u-p-r-30">
			<view>{{ sonItem.uuid }}</view>
			<view class="u-flex u-row-between">
				<view class="u-m-r-10 u-font-sm crud-style" v-if="sonItem.read ==true">R</view>
				<view class="u-m-r-10 u-font-sm crud-style" v-if="sonItem.write ==true">W</view>
				<view class="u-m-r-10 u-font-xs crud-style" v-if="sonItem.notify ==true">N</view>
				<view class="u-m-r-10 u-font-xs crud-style" v-if="sonItem.indicate == true">I</view>
			</view>
		</view>
		<view class="u-m-t-20 u-flex u-row-between u-p-r-30">
			<view></view>
			<view class="u-row-right"><u-button shape="square" size="mini" type="default" @click="clean()">清空</u-button></view>
		</view>
		<view>
			<scroll-view scroll-y="true" class="chat-sytle">
				
			<uni-list v-for="(item,index) in hexHistory" :key="item.title" :border="false">
			    <uni-list-item :border="false" :title="item.title" :rightText="item.rightText"></uni-list-item>
			</uni-list>
			
			</scroll-view>
		</view>
		<view>
		<u-field :border-top="true"	:label-width="0"   placeholder="请输入指令(hex)" v-model="msg">
				<u-button size="mini" slot="right" type="success" @click="sendHex()">发送</u-button>
		</u-field>
		</view>
		<view class="u-font-xl u-p-l-30 u-m-t-30 service-style">指令集</view>
		<view>
			<uni-list :border="false">
			    <uni-list-item :border="false" :clickable="true" @click="invoke('开机指令')" title="开机指令" ></uni-list-item>
			    <uni-list-item :border="false" :clickable="true" @click="invoke('关机指令')" title="关机指令" ></uni-list-item>
			    <uni-list-item :border="false" :clickable="true"  @click="invoke('重启指令')" title="重启指令" ></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
import Date from '@/static/datetime.js'	
	export default {
		data() {
			return {
				state: 'connected',
				connState: {
					"unconect":"(点击连接)",
					"connecting":"(连接中..)",
					"connected":"(已连接)"
				},
				query: {},
				serviceId: '',
				sonItem: {},
				hexHistory: [],
				msg: ''
			};
		},
		onLoad() {
			this.query = uni.getStorageSync("queryDevice");
			this.serviceId = this.$Route.query.serviceId;
			this.sonItem = this.$Route.query.sonItem;
			this.hexHistory=[];
			// 订阅特征值
		},
		methods:{
			goBack(){
				uni.navigateBack({
				    delta: 1
				});
				
			},
			clean(){
				this.hexHistory=[];
			},
			sendHex(){
				  // 历史记录显示
				  this.showMsg();
				  // master 发送给 slaver
				  this.notifyBLECharacteristicValue();
			},
			showMsg(){
				let timeStr =new Date().strftime('%H:%M:%S', "zh");
				let msg = {"title": this.msg,"rightText": timeStr,"order":new Date().getTime()};
				this.hexHistory.push(msg);
				this.hexHistory.sort((a,b) => {
									  if(a.order < b.order){
										  return 1;
									  }else{
										  return -1;
									  }
				})
				this.msg='';
			},
			invoke(val){
				console.log(val);
				this.msg = val;
				this.showMsg()
			},
			/**
			 * 开启订阅特征值
			 */
			notifyBLECharacteristicValue() {
				let deviceId = this.query.deviceId;
				let serviceId = this.serviceId;
				let characteristicId = this.sonItem.uuid;
				let notify = true;
				let self = this;
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
					deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId,
					success(res) {
						console.log('notifyBLECharacteristicValueChange success:' + JSON.stringify(res));

						
						uni.onBLECharacteristicValueChange(function(res) {
							console.log(`characteristic ${res.characteristicId} has changed, now is ${JSON.stringify(res.value)}`)
							var value = self.ab2hex(res.value);
							console.log(value);
							
							
								// self.writeBLECharacteristicValue(self.wirteControlCode[0].stopUploadData);
							
							console.log("----------------------------------------------");
						});
					},
					fail(res) {
						console.log('notifyBLECharacteristicValueChange failed:' + res.errMsg);
						var value = self.ab2hex(res.value);
						console.log(value);
					}
				});
			},
			// ArrayBuffer转16进度字符串
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('')
			}
		}
	}
</script>

<style scoped lang="scss">	
.dev-signal {
	color: #55aa00;
}
.conn-state {
	color: #55aa00;
}
.conn-state-unconect {
	color: #ff0000;
	margin-left: 10rpx;
}
.conn-state-connecting {
	color: #0000ff;
	margin-left: 10rpx;
}
.conn-state-connected {
	color: #55aa00;
	margin-left: 10rpx;
}
.crud-style {
	color: #55aa00;
}
.service-style {
	font-weight: bold;
}
.chat-sytle {
	height: 250rpx;
}
</style>