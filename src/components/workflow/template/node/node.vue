<template>
    <div class='node'>
        <!-- 人物设置节点 -->
        <node-wrap v-if="node.type == 'start' || node.type == 'approver' || node.type == 'notifier'"
            :node.sync="node" 
            @addNode="addNode"
            :design="design"
            @delNode="delNode">
        </node-wrap>
        <!-- 分支节点 -->
        <branch-wrap v-if="node.type == 'route'"
            :node.sync="node"
            :data.sync="data"
            :list.sync="list"
            :design="design"
            :conditionsList.sync='conditionsList'
            @addNode="addNode"
            @delNode="delNode">
        </branch-wrap>
        <!-- 条件设置节点 -->
        <condition-node v-if="node.type == 'condition'"
            :node.sync="node"
            :index="index"
            :length="length"
            :design="design"
            :conditionsList.sync='conditionsList'
            @addNode="addNode"
            @delConditionNode="delConditionNode"
            @permutation="permutation"
            @addConditionFactor="addConditionFactor">
        </condition-node>
    </div>
</template>

<script>
    import NodeWrap from './node-wrap.vue'
    import BranchWrap from '../branch/branch-wrap.vue'
    import ConditionNode from '../condition/condition-node.vue'
    export default {
        name: 'Node',
        components: {
            NodeWrap,
            BranchWrap,
            ConditionNode
        },
        data(){
            return {}
        },

        props: ['data', 'node', 'list', 'index', 'length', 'design', 'conditionsList'],

        watch:{
            node: {
                handler(val) {
                    val && this.$emit('update: node', val)
                },
                deep: true
            }
        },

        created(){},

        methods: {
            // 新增节点
            addNode (node) {
                this.$emit('addNode', node)
            },
            // 删除节点
            delNode () {
                this.$emit('delNode')
            },

            // 删除条件整个分支
            delConditionNode () {
                this.$emit('delConditionNode')
            },

            // 排列 改变分支顺序
            permutation(index, type) {
                this.$emit('permutation', index, type)
            },

            // 添加条件属性内部设置
            addConditionFactor (oldPriorityLevel, newPriorityLevel) {
                this.$emit('addConditionFactor', oldPriorityLevel, newPriorityLevel)
            }
        },

        mounted(){}
    }
</script>

