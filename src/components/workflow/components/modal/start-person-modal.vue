<template>
    <Drawer title="发起人" width="550" class="workflow-drawer" :closable="false" :value="show" @on-visible-change="getDrawerStatusChange">
        <!-- 中间内容模块 -->
        <Tabs v-model="tabs" name="tab">
            <TabPane tab="tab" label="设置发起人">
                <set-start :people="initiatePeople" :otherPeople="otherPeople" @setData="getStartPeople"></set-start>
            </TabPane>
            <!-- <TabPane tab="tab" label="表单权限设置">
                <set-table :tableListSet="tableListSet" :design="design" @tableSet="getLimits"></set-table>
            </TabPane> -->
        </Tabs>

        <div class="start-footer">
            <Button style="margin-right: 8px" @click="doSomething('cancel')">取消</Button>
            <Button type="primary" @click="doSomething('submit')">确定</Button>
        </div>
    </Drawer>
</template>

<script>
    import { ObjDeepCopy } from '../../script/uitls'
    import SetStart from '../setStart/index.vue'
    import SetTable from '../table/index.vue'
    export default {
        name: '',
        components: {
            SetStart,
            SetTable
        },
        data(){
            return {
                tabs: 0,
                tempTableListSet:  Array.isArray(this.node.properties.tableListSet) ? ObjDeepCopy(this.node.properties.tableListSet) : [],
                tempInitiatePeople: Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : [],
                tempOtherPeople: Array.isArray(this.node.properties.otherPeople) ? ObjDeepCopy(this.node.properties.otherPeople) : [],
                tableListSet: Array.isArray(this.node.properties.tableListSet) ? ObjDeepCopy(this.node.properties.tableListSet) : [],
                initiatePeople: Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : [],
                otherPeople: Array.isArray(this.node.properties.otherPeople) ? ObjDeepCopy(this.node.properties.otherPeople) : []
            }
        },

        props: ['show', 'node', 'design', 'count'],

        watch: {
            count: {
				handler() {
					this.tempTableListSet = this.tableListSet = Array.isArray(this.node.properties.tableListSet) ? ObjDeepCopy(this.node.properties.tableListSet) : []
					this.tempInitiatePeople = this.initiatePeople = Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : []
                    this.tempOtherPeople = this.otherPeople = Array.isArray(this.node.properties.otherPeople) ? ObjDeepCopy(this.node.properties.otherPeople) : []
                }
			},
        },

        created(){},

        methods: {

            // 获取设置发起|代提交人员名单
            getStartPeople(main, other, allPerson, isArray) {
                !allPerson ? this.tempInitiatePeople = main : this.tempInitiatePeople = []
                this.tempOtherPeople = other
            },

            // 获取权限设置数据
            getLimits(val) {
                this.tempTableListSet = val
            },

            // 点击确认事件
			doSomething(type) {
                let data = {
                    tableListSet: this.tempTableListSet,
                    people: this.tempInitiatePeople,
                    otherPeople: this.tempOtherPeople
                }
				this.$emit("doSomething", type, data, 'start')
			},

            // 状态控制
            getDrawerStatusChange(e){
                this.$emit("statusChange", e, 'drawer')
                !e && (this.tabs = 0)
            },
        },

        mounted(){}
    }
</script>
