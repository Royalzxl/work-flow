<template>
	<Modal class="workflow-modal" width="680" :value="show" @on-visible-change="getModalStatusChange">
		<!-- 标题 -->
		<template v-slot:header>
			<div class="header">{{name}}</div>
		</template>
		<div class="content" :key='key'>
			<!-- 左侧选择区域 -->
			<div class="content-item left">
				<!-- 多个标签页 -->
				<Tabs size="small" name="tab-1" :animated="false" v-model="tabs" v-if="modalType.length > 1">
					<TabPane tab="tab-1" v-for="(item, index) in modalType" :key="index" :label="item.name">
						<tree-body v-if="item.key == 2" :checked="chosenTree" :delData="delData" :type="item.type" @checkedData="getCheckedData"></tree-body>
						<select-body v-if="item.key == 1" :checked="chosenSelect" :type="item.type" @checkedData="getSelectData"></select-body>
					</TabPane>
				</Tabs>
				<!-- 单个标签页 -->
				<div v-else class="single">
					<tree-body v-if="modalType[0].key == 2" :isOne="true" :checked="chosenTree" :type="modalType[0].type" :delData="delData" @checkedData="getCheckedData"></tree-body>
					<select-body v-if="modalType[0].key == 1" :isOne="true" :type="modalType[0].type" :checked="chosenSelect" @checkedData="getSelectData"></select-body>
				</div>
			</div>
			<!-- 右侧选中区域 -->
			<div class="content-item right" :class="{'single-right': modalType.length == 1}">
				<chosen-body :chosenData="chosenData" @del="del"></chosen-body>
			</div>
		</div>
		<!-- 底部点击按钮 -->
		<template v-slot:footer>
			<div class="footer">
				<Button type="text" @click="doSomething('cancel')">取消</Button>
				<Button type="primary" @click="doSomething('submit')">确定</Button>
			</div>
		</template>
	</Modal>
</template>

<script>
	import { ObjDeepCopy, MinusCheck } from "../../script/uitls";
	import SelectBody from "../common/select-body.vue";
	import TreeBody from "../common/tree-body.vue";
	import ChosenBody from "../common/chosen-body.vue";
	export default {
		name: "",
		components: {
			SelectBody,
			TreeBody,
			ChosenBody
		},
		data() {
			return {
				// 高亮选中项
				tabs: 0,
				// people 数组
				chosenData: [],
				// 人员设置
				chosenSelect: [],
				// 部门|角色
				chosenTree: [],
				key: 0,
				oldType: ''
			};
		},

		props: {
			// 打开tabs类型
			// type.length <= 1 时 不显示tans组件
			// key 用于表示组件 目前支持 1，2
			// name 用于生成tabs title
			modalType: {
				type: Array,
				default: function () {
					return [
						{
							name: "按人员",
							type: 'people',
							key: 1
						}
					]
				}
			},

			// 显示
			show: {
				type: Boolean,
				default: false
			},

			// 已选数据
			dataList: {
				type: Array,
				default: function() {
					return []
				}
			},

			// 弹窗title
			name: {
				type: String,
				default: "请选择"
			},

			// 控制数据更新
			count: {
				type: Number,
				default: 0
			},

			// 判断设置发起人上下两个按钮
			type: {
				type: Number,
				default: 0
			},

			// 移除的树节点
			delData: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},

		watch: {
			count: {
				handler() {
					this.key++
					this.chosenData = ObjDeepCopy(this.dataList)
					this.chosenSelect = this.chosenData.filter(item => item.name)
					this.chosenTree = this.chosenData.filter(item => item.children || item.children === null)
					this.oldType = ''
				}
			},
		},

		created() {},

		methods: {

			// 获取tree选中数据
			getCheckedData(val, type) {
				if(this.modalType.length == 1 && this.modalType[0].type == 'role') {
					if(val[0].children.length == 0) this.chosenData = val
				} else {
					if(type == this.oldType) {
						// 特殊处理取消选中时数据
						MinusCheck(val, 1, this.chosenData)
					} else {
						this.oldType = type
					}

					// 去重
					this.chosenData = [...this.chosenData, ...val].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
				}
				
				// 防止数据污染
				let node = ObjDeepCopy(this.chosenData)

				this.chosenData = node

			},

			// 获取select选中数据
			getSelectData(val, type) {
				if(type == this.oldType) {
					// 特殊处理取消选中时数据
					MinusCheck(val, 2, this.chosenData)
				} else {
					this.oldType = type
				}

				// 去重
				this.chosenData = [...this.chosenData, ...val].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
			},

			// 点击确认事件
			doSomething(type) {
				// this.type 用于判别设置的是哪个数据
				this.$emit("doSomething", type, this.chosenData, this.type);
			},

			// 移除数据
			del(index, data) {
                if(data.children && data.children.length > 0) {
                    // 移除子节点
                    this.delGrandsons(data)
                } else {
					this.chosenData.splice(index, 1)
					this.delGrandfathers(data)
                }

				this.chosenSelect = this.chosenData.filter(item => item.name)
				this.chosenTree = this.chosenData.filter(item => item.children || item.children === null)	

                this.delData = data.children ? data : null
            },

			// 递归移除父父节点
            delGrandfathers(data) {
                // 找到删除节点的父节点
                let parentNode = this.chosenData.filter(el => el.id == data.parentId)[0]
                // 找到兄弟节点
                let brothersNode = this.chosenData.filter(el => el.parentId == data.parentId)
                // 如果兄弟节点不存在且父节点存在，则移除父级点
                if(brothersNode.length == 0 && parentNode) {
                    this.chosenData = this.chosenData.filter(el => el.id != parentNode.id)
                    this.delGrandfathers(parentNode)
                }
			},
			
			// 递归移除子节点
            delGrandsons(data) {
                if(data.children && data.children.length > 0){
                    data.children.forEach(el => {
                        if(el.children && el.children.length > 0){
                            this.delGrandsons(el)
                        }
                        this.chosenData = this.chosenData.filter(item => item.id != el.id)
                    })
                    this.chosenData = this.chosenData.filter(item => item.id != data.id)
                }
            },

			// 状态控制
			getModalStatusChange(e) {
				this.$emit("statusChange", e);
				if(!e) this.tabs = 0
			}
		},

		mounted() {}
	};
</script>
