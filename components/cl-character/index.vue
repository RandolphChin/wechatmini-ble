<template>
	<view>
		<u-collapse :head-style="headStyle" ref="collapse">
				<u-collapse-item :title="item.serviceId" v-for="(item, index) in characteristics" :key="item.serviceId">
					<u-card :head-border-bottom="false" :show-head="false" v-for="(sonItem, sonIndex) in item.characteristics" :key="sonItem.uuid" @body-click="nextDetail(item.serviceId,sonItem)">
						<view slot="body">
							<view class="u-flex u-row-between">
									<view class="u-font-xs">{{ sonItem.uuid }}</view>
									<view class="u-flex u-row-between">
										<view class="u-m-r-10 u-font-lg crud-style" v-if="sonItem.read ==true">R</view>
										<view class="u-m-r-10 u-font-lg crud-style" v-if="sonItem.write ==true">W</view>
										<view class="u-m-r-10 u-font-lg crud-style" v-if="sonItem.notify ==true">N</view>
										<view class="u-font-lg crud-style" v-if="sonItem.indicate == true">I</view>
									</view>
							</view>
						
						</view>
					</u-card>
				</u-collapse-item>
				<!-- <u-collapse-item title="item.serviceId" key="item.serviceId">
					<u-card :head-border-bottom="false" :show-head="false" key="sonItem.uuid" @body-click="nextDetail('88:34:46:52:34:45:334',example)">
						<view slot="body">
							<view class="u-flex u-row-between">
									<view class="u-font-xs">88:34:46:52:34:45:334</view>
									<view class="u-flex u-row-between">
										<view class="u-m-r-10 u-font-lg crud-style" >R</view>
										<view class="u-m-r-10 u-font-lg crud-style" >W</view>
										<view class="u-m-r-10 u-font-lg crud-style" >N</view>
										<view class="u-font-lg crud-style" >I</view>
									</view>
							</view>
						
						</view>
					</u-card>
				</u-collapse-item> -->
			</u-collapse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headStyle: {
					fontSize: '30rpx',
					marginLeft: '35rpx',
					fontWeight: 'bold'
				},
				example: {
					"uuid":"88:34:46:52:34:45:334",
					"read":true,
					"write":true,
					"notify":true,
					"indicate":true
				},
			}
		},
		props: {
			characteristics: {
				type: Array,
				default: () => {
					return [];
				}
			}
		},
		methods: {
			nextDetail(serviceId,sonItem){
				console.log(serviceId + '********' + sonItem.uuid);
				this.$Router.push({
					name: 'richPage',
					params: {
						serviceId: serviceId,
						sonItem: sonItem
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">	
.header-style {
	font-weight: bold;
	text-align: center;
}
.crud-style {
	color: #55aa00;
}
</style>
