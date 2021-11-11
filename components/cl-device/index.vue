<template>
	<view>
		<view v-for="(item, index) in devices" :key="item.deviceId">
			<u-card :head-border-bottom="false" :show-head="false" @body-click="connectDevice(item.connectable,item.deviceId,item.name,item.RSSI)">
				<view slot="body">
					<view class="u-flex u-row-between">
						<view class="u-line-2">
							<view class="u-font-xl">{{ item.name}}</view>
							<view class="u-flex u-row-between u-m-t-20">
								<view class="dev-signal">{{ item.RSSI }}</view>
								<view class="u-m-l-25">{{ item.deviceId}}</view>
							</view>
						</view>
						<view class="u-flex u-row-between">
							<view v-if="item.connectable" class="u-font-lg dev-signal">On Service</view>
							<view v-else class="u-font-lg">No services</view>
							<view class="u-m-l-20">></view>
						</view>
					</view>
				
				</view>
			</u-card>
		</view>
		<u-card :head-border-bottom="false" :show-head="false" @body-click="connectDevice(false,'58:80:3C:36:95:33','未知设备',-33)">
			<view slot="body">
				<view class="u-flex u-row-between">
					<view class="u-line-2">
						<view class="u-font-xl">未知设备yee</view>
						<view class="u-flex u-row-between u-m-t-20">
							<view class="dev-signal">信号:-33</view>
							<view class="u-m-l-25">58:80:3C:36:95:33</view>
						</view>
					</view>
					<view class="u-flex u-row-between">
						<view class="u-font-lg">No services</view>
						<view class="u-m-l-20">></view>
					</view>
				</view>
			
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			devices: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		methods: {
			connectDevice(connectable,deviceId,deviceName,rssi) {
				this.$emit("connectDev",connectable,deviceId,deviceName,rssi);
			}
		}
	}
</script>

<style scoped lang="scss">	
.dev-signal {
	color: #55aa00;
}
</style>
