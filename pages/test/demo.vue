<template>
	<view class="wrap">
			<u-row gutter="16">
				<u-col span="3">
					<view class="demo-layout bg-purple">a</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout bg-purple-light">b</view>
				</u-col>
				<u-col span="5">
					<view class="demo-layout bg-purple-dark">c</view>
				</u-col>
			</u-row>
			<u-row gutter="16" justify="space-between">
				<u-col span="3">
					<view class="demo-layout bg-purple">d</view>
				</u-col>
				<u-col span="9">
					<view class="demo-layout bg-purple-light">e</view>
				</u-col>
			</u-row>
		</view>
</template>

<script>
</script>

<style scoped lang="scss">
	.wrap {
		padding: 24rpx;
	}

	.u-row {
		margin: 40rpx 0;
	}

	.demo-layout {
		height: 80rpx;
		border-radius: 8rpx;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}
</style>
