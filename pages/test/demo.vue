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
			devices: []
		};
	},
	onShow() {
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
			if(!this.blueToothOpen){
				this.showNotice();
				return;
			}
			this.isScan = true;
			this.startBluetoothDeviceDiscovery();
		},
		stopScan() {
			this.stopBluetoothDevicesDiscovery();
		},
		showNotice(){
			uni.showToast({
							icon: "none",
							title: "请开启蓝牙",
							mask: true,
							duration: 1000
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
			//在页面加载时候初始化蓝牙适配器
			uni.openBluetoothAdapter({
				success: e => {
					console.log('初始化蓝牙成功:' + e.errMsg);
					this.blueToothOpen = true;
					console.log(this.blueToothOpen);
				},
				fail: e => {
					console.log('初始化蓝牙失败，错误码：' + (e.errCode || e.errMsg));
					this.isScan=false;
					this.showNotice();
				}
			});
		},
		listenBluetoothState(){
			uni.onBLEConnectionStateChange(res => {
				// 该方法回调中可以用于处理连接意外断开等异常情况
				console.log(`蓝牙连接状态 -------------------------->`);
				console.log(JSON.stringify(res));
				if (!res.connected) {
					if (this.isScan) return;
					console.log('断开低功耗蓝牙成功:');

					uni.showToast({
						icon: "none",
						title: "蓝牙已经断开！",
						mask: false,
						duration: 3000
					});

					//在这里尝试重连
					//this.createBLEConnection();
					//关闭连接
					this.closeBluetoothAdapter();
				}else{
					uni.showToast({
						icon: "none",
						title: "蓝牙上线了！",
						mask: false,
						duration: 3000
					});
				}
			});
		},
		/**
		 * 断开蓝牙连接
		 */
		closeBluetoothAdapter() {
			uni.closeBluetoothAdapter({
				success: res => {
					console.log('断开蓝牙模块成功');

					uni.showToast({
						icon: "none",
						title: "蓝牙已经断开！",
						mask: false,
						duration: 3000
					});
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
							uni.showToast({
								icon: "none",
								title: "查找设备失败！",
								duration: 3000
							})
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
			uni.stopBluetoothDevicesDiscovery({
				success: e => {
					this.isScan = false;
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
		}
	}
}
</script>

<style scoped lang="scss">	

</style>
