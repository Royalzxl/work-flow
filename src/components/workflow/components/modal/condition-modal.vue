<template>
    <Drawer width="550" class="workflow-drawer" :closable="false" :value="show" @on-visible-change="getDrawerStatusChange">
        <template v-slot:header>
            <div class="condition-modal-header">
                <div class="condition-modal-item">
                    <div v-if="!edit" class="node-name" @click="edit = !edit">
                        {{node.name}}
                        <i class="icon iconbianji_1"></i>
                    </div>
                    <Input v-else v-model="node.name" @on-blur="edit = !edit"/>
                </div>
                <div class="condition-modal-item">
                    <Select v-model="conditionConfig.priorityLevel" style="width:100px">
                        <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Tooltip placement="bottom-end" max-width="300">
                        <i class="icon iconwenzishuoming"></i>
                        <template v-slot:content>
                            <div>首先匹配“优先级1”的条件。如果匹配成功则审批单发送给该条件下的审批人和抄送人；如果匹配不成功则继续进行匹配下一优先级的条件。</div>
                        </template>
                    </Tooltip>
                </div>
            </div>
        </template>

        <!-- 条件设置组件 -->
        <set-condition :conditionsRuleList="conditionConfig.properties.conditionsRules" :design="design" @setData="getConditionsRules"></set-condition>

        <div class="start-footer">
            <Button style="margin-right: 8px" @click="doSomething('cancel')">取消</Button>
            <Button type="primary" @click="doSomething('submit')">确定</Button>
        </div>
    </Drawer>
</template>

<script>
    import { ObjDeepCopy } from '../../script/uitls'
    import SetCondition from '../setCondition/index.vue'
    export default {
        name: '',
        components: {
            SetCondition,
        },
        data(){
            return {
                edit: false,
                conditionConfig: {},
                tempConditionsRules: []
            }
        },

        props: ['show', 'node', 'length', 'design', 'count'],

        computed: {
            levelList() {
                let list = []
                for(let i = 1; i <= this.length; i++) {
                    let tepm = {
                        value: i,
                        label: `优先级${i}`
                    }
                    list.push(tepm)
                }
                return list
            }
        },

        watch: {
            count: {
                handler() {
                    this.conditionConfig = ObjDeepCopy(this.node)
                },
                immediate: true
            }
        },

        created(){},

        methods: {

            // 获取设置数据
            getConditionsRules(val) {
                this.tempConditionsRules = val
            },

            // 确定|取消
            doSomething(type) {
                if(this.tempConditionsRules.length == 0){
                    this.$Message.error('请先添加条件');
                    return false;
                } else {
                    let msg = null
                    this.tempConditionsRules.forEach(el => {
                        // 发起人条件判断
                        if(el.type == 'condition_dept' && el.person.length == 0) msg = '请先设置条件内容'
                        // 单选条件判断
                        if((el.type == 'condition_value' || el.type == 'condition_multi') && el.paramValues.length == 0) msg = '请先设置条件内容'
                    })
                    if(msg) {
                        this.$Message.error(msg);
                        return false;
                    }
                }
                this.$emit('doSomething', type, this.conditionConfig, this.tempConditionsRules);
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
