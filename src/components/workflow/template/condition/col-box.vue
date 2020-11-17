<template>
    <div class="col-box">
        <div class="top-left-cover-line" v-if="subscript == 0"></div>
        <div class="bottom-left-cover-line" v-if="subscript == 0"></div>
        <div class="top-right-cover-line" v-if="subscript == (length-1)"></div>
        <div class="bottom-right-cover-line" v-if="subscript == (length-1)"></div>
        <node v-for="(item, index) in childNodeList"
            :key="index"
            :node.sync="childNodeList[index]"
            :data.sync="data"
            :design='design'
            :index="subscript"
            :list.sync="childNodeList"
            :length="length"
            :conditionsList.sync="conditionsList"
            @addNode="addNode"
            @delNode="delNode(item)"
            @delConditionNode="delConditionNode"
            @permutation="permutation"
            @addConditionFactor="addConditionFactor">
        </node>
    </div>
</template>

<script>
    import { IteratorData, AddNewNode, RemoveNode } from '../../script/uitls'
    export default {
        name: '',
        components: {},
        data(){
            return {
                // 分支节点下子节点列表
                childNodeList: [],
            }
        },

        props: ['data','node', 'subscript', 'length', 'design', 'conditionsList'],

        watch: {
            node: {
                handler(val) {
                    if(val) this.getNode(val)
                },
                deep: true
            },
            childNodeList: {
                handler(val) {
                    val && (this.childNodeList = val)
                },
                deep: true
            }
        },

        created(){},

        methods: {
            // 获取列表数据
            getNode (node) {
                this.childNodeList = []
                IteratorData(this.childNodeList, node)
            },

            // 新增节点
            addNode (node) {
                AddNewNode(node, this.node, this.childNodeList)
                this.$emit('update:node', this.node)
            },
            
            // 删除节点
            delNode (node) {
                RemoveNode(node, this.node, this.childNodeList)
                this.$emit('update:node', this.node)
            },

            // 删除条件整个分支
            delConditionNode () {
                this.$emit('delConditionNode')
            },

            // 排列 改变分支顺序
            permutation(index, type) {
                this.$emit('permutation', index, type)
            },

            // 添加条件内部设置
            addConditionFactor (oldPriorityLevel, newPriorityLevel) {
                this.$emit('addConditionFactor', oldPriorityLevel, newPriorityLevel)
            }
        },

        mounted(){
            // 初始化构造数据
            if(this.node) {
                this.getNode(this.node)
            }
        }
    }
</script>
