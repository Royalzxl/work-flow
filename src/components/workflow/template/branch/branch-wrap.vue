<template>
    <div class='branch-wrap'>
        <div class="branch-box-wrap">
            <!-- 分支节点 -->
            <branch-wrap-box @addCondition="addCondition">
                <!-- 插槽的应用 -->
                <col-box v-for="(item, index) in node.conditionNodes"
                    :key="index"
                    :node.sync="node.conditionNodes[index]"
                    :data.sync="data"
                    :design="design"
                    :subscript="index"
                    :conditionsList.sync="conditionsList"
                    :length="node.conditionNodes ? node.conditionNodes.length : 0"
                    @delConditionNode="delConditionNode(item)"
                    @permutation="permutation"
                    @addConditionFactor="addConditionFactor">
                </col-box>
            </branch-wrap-box>
            <!-- 添加节点按钮 -->
            <add-node-btn :node="node" @addNode="addNode"></add-node-btn>
        </div>
    </div>
</template>

<script>
    import { RemoveConditionNode } from '../../script/uitls'
    import BranchWrapBox from './branch-wrap-box.vue'
    import ColBox from '../condition/col-box.vue'
    import AddNodeBtn from '../addBtn/add-node-btn'
    export default {
        name: '',
        components: {
            BranchWrapBox,
            ColBox,
            AddNodeBtn
        },
        data(){
            return {}
        },

        props: ['data', 'node', 'list', 'design', 'conditionsList'],

        watch: {
            node: {
                handler(val) {
                    val && this.$emit('update:node', val)
                },
                deep: true
            }
        },

        created(){},

        methods: {
            // 新增条件分支
            addCondition() {
                let len = this.node.conditionNodes.length,
                    lastNode = this.node.conditionNodes[len - 1],
                    name = '条件' + (len + 1),
                    priorityLevel = len + 1,
                    node = {
                        name: name,
                        type: 'condition',
                        prevId: this.node.nodeId,
                        nodeId: `Condition_${new Date().getTime() + len * 10}`,
                        priorityLevel: priorityLevel,
                        properties: {
                            conditionsRules: []
                        }
                    };
                this.node.conditionNodes.push(node)
            },

            // 删除条件分支
            delConditionNode(conditionNode) {
                RemoveConditionNode(conditionNode, this.node, this.data, this.list, this.conditionsList)
                // this.$emit('update:data', this.data)
            },

            // 排列 改变分支顺序 type -1向左, 1向右
            permutation(index, type) {
                // 数组交换顺序
                this.node.conditionNodes[index] = this.node.conditionNodes.splice(index + type, 1, this.node.conditionNodes[index])[0]
                // 不更改优先级
                this.node.conditionNodes.map((item, index) => {
                    item.priorityLevel = index + 1
                })
                this.$set(this.node, 'conditionNodes', this.node.conditionNodes)
            },

            // 设置条件内内容
            addConditionFactor(oldPriorityLevel, newPriorityLevel) {
                // 获取改变前下标
                let node = this.node.conditionNodes.splice(oldPriorityLevel - 1, 1)
                this.node.conditionNodes.splice(newPriorityLevel - 1, 0, node[0])
                // 界面显示不更改优先级
                this.node.conditionNodes.map((item, index) => {
                    item.priorityLevel = index + 1
                })
                this.$set(this.node, 'conditionNodes', this.node.conditionNodes)
            },

            // 新增节点
            addNode(node) {
                this.$emit('addNode', node)
            }
        },

        mounted(){}
    }
</script>
