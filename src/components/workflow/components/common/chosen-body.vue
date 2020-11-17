<template>
	<div class="chosen-body">
		<p>已选:</p>
		<div class="chosen-wrap">
			<ul>
				<li v-for="(item, index) in chosenData" :key="index">
					<div class="title">
						<i v-if="item.name" class="icon icontianjiarenyuan"></i>
						{{item.title || item.name}}
					</div>
					<div class="action" @click="delSelectData(index, item)">
						<i class="icon iconguanbi1"></i>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: "",
		components: {},
		data() {
			return {};
		},

		props: ["chosenData"],
		
		created() {},

		methods: {
			// 移除选项
			delSelectData(index, data) {
				this.$emit('del', index, data)
			}
		},

		mounted() {}
	};
</script>
