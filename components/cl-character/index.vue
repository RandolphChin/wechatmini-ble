<template>
	<view>
		<u-collapse :head-style="headStyle" ref="collapse">
				<u-collapse-item :title="item.serviceId" v-for="(item, index) in characteristics" :key="item.serviceId">
					<u-card :head-border-bottom="false" :show-head="false" v-for="(sonItem, sonIndex) in item.characteristics" :key="sonItem.uuid">
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
				}
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
