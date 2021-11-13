<template>
	<view class="content">
		<u-row gutter="16" justify="center">
			<u-col span="6">
				<view class=""><u-button  type="primary" :loading="isScan" @click="startScan()">扫描</u-button></view>
			</u-col>
			<u-col span="6">
				<view class="demo-layout"><u-button type="error" @click="stopScan()">停止扫描</u-button></view>
			</u-col>
		</u-row>
		<view><cl-device :devices="devices" @connectDev="connectDev"></cl-device></view>

	</view>		
</template>

<script>
export default {
	data() {
		return {
			isScan: false,
			blueToothOpen: false,
			locationOpen: true,
			devices: []
		};
	},
	onShow() {
		this.checkLocation();
		// 初始化蓝牙模块
		this.initBluetoothAdapter();
		//同时监听蓝牙连接状态
		this.listenBluetoothState();
	},
	methods: {
		
		startScan() {
			 // 初始化蓝牙模块
			this.initBluetoothAdapter();
			//同时监听蓝牙连接状态
			this.listenBluetoothState();
			this.checkLocation();
			if(!this.locationOpen){
				this.showNotice("请开启定位");
				return;
			}
			if(!this.blueToothOpen){
				this.showNotice("请开启蓝牙");
				return;
			}
			this.isScan = true;
			this.startBluetoothDeviceDiscovery();
		},
		stopScan() {
			this.stopBluetoothDevicesDiscovery();
		},
		showNotice(msg){
			uni.showToast({
							icon: "none",
							title: msg,
							mask: true,
							duration: 2000
						});
		},
		connectDev(connectable,deviceId,deviceName,rssi){
			let queryDevice = {};
			queryDevice.deviceId=deviceId;
			queryDevice.name=deviceName;
			queryDevice.rssi=rssi;
			uni.setStorageSync("queryDevice",queryDevice);
			// 停止搜索
			this.stopBluetoothDevicesDiscovery();
			 this.$Router.push({
			 	name: 'newpage',
			 	params: {
			 		deviceId: deviceId,
					name: deviceName,
					rssi: rssi
			 	}
			 });
		},
		initBluetoothAdapter(){
			let that = this;
			//在页面加载时候初始化蓝牙适配器
			uni.openBluetoothAdapter({
				success: e => {
					console.log('初始化蓝牙成功:' + e.errMsg);
					that.blueToothOpen = true;
					console.log(this.blueToothOpen);
				},
				fail: e => {
					console.log('初始化蓝牙失败，错误码：' + (e.errCode || e.errMsg));
					that.blueToothOpen = true;
					that.isScan=false;
					that.showNotice("请打开蓝牙");
				}
			});
		},
		listenBluetoothState(){
			let that = this;
			uni.onBLEConnectionStateChange(res => {
				// 该方法回调中可以用于处理连接意外断开等异常情况
				console.log(`蓝牙连接状态 -------------------------->`);
				console.log(JSON.stringify(res));
				if (!res.connected) {
					if (this.isScan) return;
					console.log('断开低功耗蓝牙成功:');
					that.showNotice("蓝牙已经断开");
					//在这里尝试重连
					//this.createBLEConnection();
					//关闭连接
					that.closeBluetoothAdapter();
				}else{
					that.showNotice("蓝牙已经连接");
				}
			});
		},
		/**
		 * 断开蓝牙连接
		 */
		closeBluetoothAdapter() {
			let that = this;
			uni.closeBluetoothAdapter({
				success: res => {
					console.log('断开蓝牙模块成功');
					that.showNotice("蓝牙已经断开");
				}
			});
		},
		startBluetoothDeviceDiscovery() {
			//在页面显示的时候判断是都已经初始化完成蓝牙适配器若成功，则开始查找设备
			let self = this;
			setTimeout(function() {
				if (self.blueToothOpen) {
					console.log("开始搜寻智能设备");
					uni.startBluetoothDevicesDiscovery({
						success: res => {
							console.log('--------find success----' + res)
							self.onBluetoothDeviceFound();
						},
						fail: res => {
							console.log("查找设备失败!");
							that.showNotice("查找设备失败");
						}
					});
				} else {
					console.log("未初始化蓝牙是配饰器：" + self.isOpenBle);
				}
			}, 1000);
		},
		/**
		 * 停止搜索蓝牙设备
		 */
		stopBluetoothDevicesDiscovery() {
			let that = this;
			uni.stopBluetoothDevicesDiscovery({
				success: e => {
					that.isScan = false;
					console.log('停止搜索蓝牙设备:' + e.errMsg);
				},
				fail: e => {
					console.log('停止搜索蓝牙设备失败，错误码：' + e.errCode);
				}
			});
		},
		/**
		 * 发现外围设备
		 */
		onBluetoothDeviceFound() {
			let that = this;
			console.log("监听寻找新设备");
			that.getBluetoothDevices()
			uni.onBluetoothDeviceFound(devices => {
				console.log('开始监听寻找到新设备的事件');
				that.getBluetoothDevices();
			});
		},
		/**
		 * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
		 */
		getBluetoothDevices() {
			let that = this;
			console.log("获取蓝牙设备");
			uni.getBluetoothDevices({
				success: res => {
					console.log('获取蓝牙设备成功:' + res.errMsg);
					console.log(res.devices);
					that.devices = res.devices
				},
				fail: e => {
					console.log('获取蓝牙设备错误，错误码：' + e.errCode);
				}
			});
		},
		checkLocation(){
			let that = this;
			console.log('--your platform is ' + uni.getSystemInfoSync().platform);
			if(uni.getSystemInfoSync().platform == 'android'){
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.getLocation({
							type: 'wgs84',
							success: function (res) {
								console.log('当前位置的经度：' + res.longitude);
								console.log('当前位置的纬度：' + res.latitude);
								that.locationOpen = true;
							},
							fail(r){
								console.log('------ location ---err--' +r);
								that.locationOpen = false;
							}
						});
					},
					fail(){
						console.log('------ refuse -----');
					}
				});
			}
		}
	}
}
</script>

<style scoped lang="scss">	

</style>
