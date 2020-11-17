<template>
    <div class='item-tree'>
        <p>选择:</p>
        <div class="tree-wrap">
            <div class="search">
                <Input search v-model="searchValue" :placeholder="placeholders" style="width: auto" @on-search="getSearch($event)" />
            </div>
            <div class="wrap-inner">
                <Tree ref="wrapTree" empty-text="需请求接口数据" v-if="type != 'role'" :data="treeData" check-directly show-checkbox @on-check-change="getSelectData"/>
                <Tree ref="wrapTree" empty-text="需请求接口数据" v-if="type == 'role'" :data="treeData" @on-select-change="getSelectData"/>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 人员0 部门1 角色2 岗位3 数据对象里面 新增type控制不同数据类型 
     */
    // import { getDepartTree, findByTitle } from '~script/api/company/organization'
    // import { getRoleTree, searchRole } from '~script/api/company/role'
    export default {
        name: '',
        components: {},
        data(){
            return {
                treeData: [],
                treeSelectData: [],
                searchValue: ''
            }
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
            delData: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            isOne: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            placeholders() {
                return this.type == 'department' ? '按部门名称搜索' : this.type == 'role' ? '按角色(组)名称搜索' : '请输入搜索内容'
            }
        },

        watch: {
            delData: {
                handler(val){
                    val && this.delGrandsons(val)
                },
                deep: true
            },
            checked: {
                handler(val){
                    this.searchValue = ''
                    // 处理 单个组件 数据显示
                    setTimeout(() => {
                        if(this.isOne && val.length == 0)
                            this.changeTree(null, null, true)
                        if(this.isOne && val.length > 0)
                            val.forEach(el => this.changeTree(el))
                        if(this.isOne) this.$forceUpdate()
                    }, 100)
                },
                deep: true
            },
            searchValue: {
                handler(val) {
                    if(val == '') {
                        this.getTreeData()
                    }
                }
            }
        },

        created(){
            // this.getTreeData()
        },

        methods: {

            // 递归遍历删除子节点
            delGrandsons(data) {
                this.changeTree(data, true)
                if(data.children && data.children.length > 0){
                    data.children.forEach(el => {
                        if(el.children && el.children.length > 0){
                            this.delGrandsons(el)
                        } 
                        this.changeTree(el, true)
                    })
                }
            },
            
            // 搜索数据
            getSearch(val) {
                if(this.type == 'role' && !this.searchValue == '') this.getSearchRole()
                if(this.type == 'department' && !this.searchValue == '') this.getSearchDepart()
            },

            // 获取Tree中选中数据Tree 
            getSelectData() {
                // 获取选中
                let Nodes = this.type == 'role' ? this.$refs.wrapTree.getSelectedNodes() : this.$refs.wrapTree.getCheckedNodes()

                if(this.type == 'role' && Nodes[0].children.length > 0){
                    this.changeTree(Nodes[0], true)
                }

                this.treeSelectData = Nodes

                this.$emit('checkedData', this.treeSelectData, this.type)
            },

            // 递归查询Tree数据,修改选中状态
            changeTree(data, type, init){
                const fn = (child)  => {

                    // 单独处理没有选中数据时
                    if(init && !data) {
                        if(this.type != 'role') this.$set(child, 'checked', false)
                        else this.$set(child, 'selected', false)
                    }

                    // 删除选中
                    if(data && child.id == data.id && type) {
                        // this.$set(child, 'checked', false) 这个在这里 iview 不执行
                        // 动态更新checked iview Tree 自带方法
                        if(this.type != 'role') this.$refs.wrapTree.handleCheck({checked: false, nodeKey: child.nodeKey}, true)
                        else this.$refs.wrapTree.handleSelect(child.nodeKey, true)
                    }
                    
                    // 数据初始化
                    if(data && child.id == data.id && !type) {
                        if(this.type != 'role') this.$set(child, 'checked', true)
                        else this.$set(child, 'selected', true)
                    } 

                    if (child.children && child.children.length > 0) {
                        // 开始循环子节点
                        for (let i = 0; i < child.children.length; i++) {
                            fn(child.children[i])
                        }
                    }
                };
                // 开始对树根级别的节点循环
                for(let k = 0; k < this.treeData.length; k++){
                    fn(this.treeData[k])
                }
            },

            // 处理角色名称不一样与孩子子节点为null的问题
            // 同时设置 数据type类型 用于判断后台判断是那种数据
            setType(type, data = [], isRole) {
                const fn = (child)  => {
                    child.type = type
                    isRole && (child.title = child.nameCn)
                    if (child.children && child.children.length > 0) {
                        // 开始循环子节点
                        for (let i = 0; i < child.children.length; i++) {
                            fn(child.children[i])
                        }
                    }
                    if(child.children == null) child.children = []
                };
                // 开始对树根级别的节点循环
                for(let k = 0; k < data.length; k++){
                    fn(data[k])
                }   
            },

            // 获取部门树|岗位|角色树
            // 此处缺少岗位树
            getTreeData() {
                // 部门
                if(this.type == 'department') {
                    getDepartTree().then(res => {
                        if(res.code == 0) {
                            this.setType(1, res.result.children)
                            this.treeData = res.result.children
                            console.log(this.treeData)
                            this.checked.forEach(el => {
                                this.changeTree(el)
                            })
                        }
                    }).catch(() => {})
                }

                // 岗位 没有数据
                if(this.type == 'position') {
                    this.setType(3, [])
                    this.treeData = []
                    this.checked.forEach(el => {
                        this.changeTree(el)
                    })
                }

                // 角色
                if(this.type == 'role') {
                    getRoleTree().then(res => {
                        if(res.code == 0) {
                            this.setType(2, res.result, true)
                            this.treeData = res.result
                            this.checked.forEach(el => {
                                this.changeTree(el)
                            })
                        }
                    }).catch(() => {})
                }
            },

            // 根据名字查询角色
            getSearchRole() {
                // searchRole({nameCn: this.searchValue}).then(res => {
                //     if(res.code === 0) {
                //         this.setType(2, res.result, true)
                //         this.treeData = res.result
                //         this.checked.forEach(el => {
                //             this.changeTree(el)
                //         })
                //     }
                // }).catch(() => {})
            },
            
            // 根据部门名称查询部门
            getSearchDepart() {
                // findByTitle({title: this.searchValue}).then(res => {
                //     if(res.code == 0) {
                //         this.setType(1, res.result)
                //         this.treeData = res.result
                //         this.checked.forEach(el => {
                //             this.changeTree(el)
                //         })
                //     }
                // })
            }
        },

        mounted(){
            
        }
    }
</script>
