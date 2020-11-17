<template>
    <div class='add-node-btn-box'>
        <!-- 按钮 -->
        <div class="add-node-btn">
            <Poptip placement="right" width="256" v-model="visible">
                <Icon type="md-add" size="16" class="btn"/>
                <!-- 弹窗显示内容 -->
                <template v-slot:content>
                    <div class="add-node-poptip-body">
                        <div class="add-node-poptip-item approver" @click="addNode(1)">
                            <div class="item-wrapper">
                                <Icon type="logo-freebsd-devil" size="28"/>
                            </div>
                            <p>审批人</p>
                        </div>
                        <div class="add-node-poptip-item notifier" @click="addNode(2)">
                            <div class="item-wrapper">
                                <Icon type="ios-paper-plane" size="28"/>
                            </div>
                            <p>抄送人</p>
                        </div>
                        <div class="add-node-poptip-item condition" @click="addNode(3)">
                            <div class="item-wrapper">
                                <Icon type="md-git-branch" size="28"></Icon>
                            </div>
                            <p>条件分支</p>
                        </div>
                    </div>
                    <!-- 关闭按钮 -->
                    <Icon type="ios-close" class="close" @click="close"></Icon>
                </template>
            </Poptip>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return {
                visible: false
            }
        },

        props: ['node'],

        created(){},

        methods: {
            // 添加节点
            addNode(type) {
                let node = null
                // 审批人
                if(type == 1) {
                    node = {
                        type: 'approver',
                        name: '审批人',
                        nodeId: `Approver_${new Date().getTime()}`,
                        prevId: this.node.nodeId,
                        properties: {
                            people: [],
                            personType: '1',
                            approverType: '1'
                        }
                    }
                }
                // 抄送人
                if(type == 2) {
                    node = {
                        type: 'notifier',
                        name: '抄送人',
                        nodeId: `Notifier_${new Date().getTime()}`,
                        prevId: this.node.nodeId,
                        properties: {
                            people: []
                        }
                    }
                }
                // 条件分支
                if(type == 3) {
                    let time = new Date().getTime(),
                        nodeId = `Route_${time}`;
                    node = {
                        type: 'route',
                        name: '条件分支',
                        prevId: this.node.nodeId,
                        nodeId: nodeId,
                        conditionNodes: [
                            { name: '条件1', type: 'condition', prevId: nodeId, nodeId: `Condition_${time + 10}`, priorityLevel: 1, properties: {conditionsRules: []}},
                            { name: '条件2', type: 'condition', prevId: nodeId, nodeId: `Condition_${time + 20}`, priorityLevel: 2, properties: {conditionsRules: []}}
                        ]
                    }
                }
                this.$emit('addNode', node)
                this.close()
            },
            // 内部关闭弹窗
            close() {
                this.visible = false
            }
        },

        mounted(){}
    }
</script>
