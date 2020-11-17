<template>
    <Drawer width="550" class="workflow-drawer" :closable="false" :value="show" @on-visible-change="getDrawerStatusChange">
        <template v-slot:header>
            <div v-if="!edit" class="node-name" @click="edit = !edit">
                {{node.name}}
                <i class="icon iconbianji_1"></i>
            </div>
            <Input v-else v-model="node.name" @on-blur="edit = !edit"/>
        </template>

        <!-- 抄送人设置 -->
        <set-notifier :people="notifier" :isArrow.sync="node.properties.isArrow" @setData="getNotifierPeople"></set-notifier>

        <div class="start-footer">
            <Button style="margin-right: 8px" @click="doSomething('cancel')">取消</Button>
            <Button type="primary" @click="doSomething('submit')">确定</Button>
        </div>
    </Drawer>
</template>

<script>
    import { ObjDeepCopy } from '../../script/uitls'
    import SetNotifier from '../setNotifier/index.vue'
    export default {
        name: '',
        components: {
            SetNotifier,
        },
        data(){
            return {
                edit: false,
                tempNotifier: Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : [],
                notifier: Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : []
            }
        },

        props: ['show', 'node', 'design', 'count'],

        watch: {
            count: {
				handler() {
                    this.tempNotifier = this.notifier = Array.isArray(this.node.properties.people) ? ObjDeepCopy(this.node.properties.people) : []
                }
            }
        },

        created(){},

        methods: {
            // 获取设置审批人员名单
            getNotifierPeople(people) {
                this.tempNotifier = people
            },

            // 点击确认事件
			doSomething(type) {
                let data = {
                    people: this.tempNotifier,
                }
                if(!this.node.properties.isArrow && this.tempNotifier.length == 0){
                    this.$Message.error('请先添加成员');
                    return false;
                }
				this.$emit("doSomething", type, data, 'notifier')
			},

            // 状态控制
            getDrawerStatusChange(e){
                this.$emit("statusChange", e, 'drawer');
                !e && (this.edit = false)
            }
        },

        mounted(){}
    }
</script>
