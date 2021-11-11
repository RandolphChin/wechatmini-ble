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
		<view><cl-character :characteristics="characteristics"></cl-character></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			query:{},
			state: 'unconect',
			connState: {
				"unconect":"(点击连接)",
				"connecting":"(连接中..)",
				"connected":"(已连接)"
			},
			characteristics: []
				
			
		}
	},
	onLoad() {
		this.query = this.$Route.query;
	},
	methods: {
		showNotice(msg){
			uni.showToast({
							icon: "none",
							title: msg,
							mask: true,
							duration: 3000
						});
		},
		buildConnect(){
			console.log(this.query.deviceId);
			this.state='connecting';
			this.createBLEConnection();
		},
		/**
		 * 连接设备
		 */
		createBLEConnection() {
			//设备deviceId
			let deviceId = this.query.deviceId;
			let self = this;
			uni.createBLEConnection({
				// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
				deviceId,
				success: res => {
					console.log("设备连接成功！");
					console.log(JSON.stringify(res))
					this.state='connected';
					//延迟1.5s获取设备的services
					setTimeout(function() {
						console.log("获取设备的services");
						self.getBLEDeviceServices();
					}, 1000);
				},
				fail: res => {
					console.log(JSON.stringify(res));
					console.log("设备连接失败！");
					this.showNotice("设备连接失败！");
				}
			});
		},
		/**
		 * 获取设备的服务ID
		 */
		getBLEDeviceServices() {
			let deviceId = this.query.deviceId;
			let serviceList = [];
			let self = this;
			uni.getBLEDeviceServices({
				// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
				deviceId,
				success: res => {
					console.log('获取设备的服务列表')
					console.log(JSON.stringify(res));
					serviceList = res.services;
					this.characteristics=[];
					for (let i = 0; i < serviceList.length; i++) {
						let service = serviceList[i];
						console.log(JSON.stringify(service) + "----serviceID：" + service.uuid);
						//开始获取指定服务的特征值
						self.getBLEDeviceCharacteristics(service.uuid);
						
					}
				},
				fail: res => {
					console.log('device services:', res.services)
					this.showNotice(res.errMsg);
				}
			});
		},
		/**
		 * 获取指定服务的特征值
		 */
		getBLEDeviceCharacteristics(serviceId) {
			let deviceId = this.query.deviceId;
			let characteristicsList = [];
			let self = this;
			
			
			uni.getBLEDeviceCharacteristics({
				// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
				deviceId,
				// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
				serviceId,
				success: res => {
					console.log(JSON.stringify(res));
					console.log("获取的" + serviceId + "服务的特征值：" + JSON.stringify(res.characteristics));
					// 服务特征一组
					let oneGroup =[];
					res.characteristics.forEach( k => {
						let oneCharacter = {};
						oneCharacter.uuid = k.uuid;
						oneCharacter.read = k.properties.read;
						oneCharacter.write = k.properties.write;
						oneCharacter.notify = k.properties.notify;
						oneCharacter.indicate = k.properties.indicate;
						oneGroup.push(oneCharacter);
					})
					let oneService = {};
					oneService.serviceId = serviceId;
					oneService.characteristics = oneGroup;
					this.characteristics.push(oneService);
					console.log('=====================');
					console.log(JSON.stringify(this.characteristics));
				},
				fail: res => {
					console.log('device getBLEDeviceCharacteristics failed:', JSON.stringify(res))
					this.showNotice(res.errMsg);
				}
			})
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
</style>