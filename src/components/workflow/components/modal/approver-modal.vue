<template>
    <Drawer width="550" class="workflow-drawer" :closable="false" :value="show" @on-visible-change="getDrawerStatusChange">
        <template v-slot:header>
            <div v-if="!edit" class="node-name" @click="edit = !edit">
                {{node.name}}
                <i class="icon iconbianji_1"></i>
            </div>
            <Input v-else v-model="node.name" @on-blur="edit = !edit"/>
        </template>

        <!-- 中间内容模块 -->
        <Tabs v-model="tabs">
            <TabPane label="设置审批人">
                <set-approver :key="key"
                    :people="approver" 
                    :personType="node.properties.personType"
                    :approverType="node.properties.approverType"
                    @setData="getApproverPeople" @setTemp="setTemp">
                </set-approver>
            </TabPane>
            <!-- <TabPane label="表单权限设置">
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
    import SetApprover from '../setApprover/index.vue'
    import SetTable from '../table/index.vue'
    export default {
        name: '',
        components: {
            SetApprover,
            SetTable
        },
        data(){
            return {
                edit: false,
                tabs: 0,
                key: 0,
                tempTableListSet: Array.isArray(this.node.properties.tableListSet) ? ObjDeepCopy(this.node.properties.tableListSet) : [],
                tempApprover: Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : [],
                tempPersonType: '1',
                tempApproverType: '1',
                tableListSet: Array.isArray(this.node.properties.tableListSet) ? ObjDeepCopy(this.node.properties.tableListSet) : [],
                approver: Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : [],
            }
        },

        props: ['show', 'node', 'design', 'count'],

        watch: {
            count: {
				handler() {
				    this.key++
					this.tableListSet = Array.isArray(this.node.properties.tableListSet) ? ObjDeepCopy(this.node.properties.tableListSet) : []
                    this.tempApprover = this.approver = Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : []
                    // 回显时需要把数据赋值给 这两个值，未操作时 数据同步
                    if(this.node.properties.personType != '') this.tempPersonType = this.node.properties.personType
                    if(this.node.properties.approverType != '') this.tempApproverType = this.node.properties.approverType
                }
            }
        },

        created(){},

        methods: {
            
            // 获取设置审批人员名单
            getApproverPeople(people) {
                this.tempApprover = people
            },
            // 设置类型
            setTemp(type, val){
                if (type == 'personType') {
                    this.tempPersonType = val
                } else {
                    this.tempApproverType = val
                }
            },
            // 获取权限设置数据
            getLimits(val) {
                this.tempTableListSet = val
            },

            // 点击确认事件
			doSomething(type) {
                // debugger
                let data = {
                    tableListSet: this.tempTableListSet,
                    people: this.tempApprover,
                    personType: this.tempPersonType,
                    approverType: this.tempApproverType
                };

                if(data.personType=='3'&&data.people.length<1){
                    this.$Message.error('请先添加指定成员');
                    return false;
                }
                else if(data.personType=='2'&&data.people.length<1){
                    this.$Message.error('请先添加角色');
                    return false;
                }

				this.$emit("doSomething", type, data, 'approver')
			},

            // 状态控制
            getDrawerStatusChange(e){
                this.$emit("statusChange", e, 'drawer');
                if(!e) {
                    this.edit = false
                    this.tabs = 0
                }
            }
        },

        mounted(){}
    }
</script>
