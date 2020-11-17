<template>
	<div class="item-select">
		<p>选择:</p>
		<div class="select-wrap">
			<div class="search">
				<Input v-model="searchValue" search :placeholder="placeholders" style="width: auto" @on-keyup="getSearch($event)" />
			</div>
			<div class="wrap-inner wrap-select">
				<multi-check :options="people" :checked="checked" @change="getSelectData"></multi-check>
			</div>
		</div>
	</div>
</template>

<script>
	/**
     * 人员0 部门1 角色2 岗位3 数据对象里面 新增type控制不同数据类型 
     */
	import { ObjDeepCopy } from '../../script/uitls'
	import MultiCheck from "./multi-check.vue";
	// import { getAll } from '~script/api/company/staffs'
	// import { searchRole } from '~script/api/company/role'
	export default {
		name: "",
		components: {
			MultiCheck
		},
		data() {
			return {
				people: [],
				tempPeople: [],
				searchValue: ''
			};
		},

		props: {
			checked: {
				type: Array,
				default: function() {
					return []
				}
			}, 
			type: {
                type: String,
                default: ''
            }, 
			isOne: {
                type: Boolean,
                default: false
            }
		},

		computed: {
            placeholders() {
                return this.type == 'people' ? '按人员姓名搜索' : this.type == 'role' ? '按角色名称搜索' : '请输入搜索内容'
            }
        },

		watch: {
			checked: {
				handler(val) {
					this.$forceUpdate()
				},
				deep: true
			}
		},

		created() {
			// this.getPeople()
		},

		methods: {
			// 获取数据
			getPeople() {
				if(this.type == 'people') {
					getAll().then(res => {
						if (res.code === 0) {
							res.result.forEach((item, index) => {
								let temp = {}
								temp.id = item.id
								temp.name = item.name
								temp.type = 0
								this.people.push(temp)
								this.tempPeople.push(temp)
							});
							// 修复ie 数据重复问题 hook
							this.people = [...this.people].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
							this.tempPeople = [...this.tempPeople].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
						}
					}).catch(() => {});
				} else {
					searchRole({nameCn: this.searchValue}).then(res => {
						if(res.code === 0) {
							res.result.forEach((item, index) => {
								let temp = {}
								temp.id = item.id
								temp.name = item.nameCn
								temp.type = 2
								this.people.push(temp)
								this.tempPeople.push(temp)
							})
							// 修复ie 数据重复问题 hook
							this.people = [...this.people].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
							this.tempPeople = [...this.tempPeople].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
						}
					}).catch(() => {})
				}
				
			},

			// 搜索 本地模糊搜索
			getSearch(evt) {
				if(this.type == 'role' && !this.searchValue == '') {
					this.getSearchRole()
				} else {
					let Data = ObjDeepCopy(this.people)
					this.people = Data.filter(item => (~item.name.indexOf(this.searchValue)))
					if(!this.searchValue) {
						this.people = this.tempPeople
					}
				}
			},

			// 根据名字查询角色
            getSearchRole() {
                // searchRole({nameCn: this.searchValue}).then(res => {
                //     if(res.code === 0) {
				// 		res.result.forEach((item, index) => {
				// 			let temp = {}
				// 			temp.id = item.id
				// 			temp.name = item.nameCn
				// 			temp.type = 2
				// 			this.people.push(temp)
				// 		})
				// 		// 修复ie 数据重复问题 hook
				// 		this.people = [...this.people].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])
                //     }
                // }).catch(() => {})
			},

			// 获取选择数据
			getSelectData(val) {
				this.$emit('checkedData', val, this.type)
			}
		},

		mounted() {
			
		}
	};
</script>
