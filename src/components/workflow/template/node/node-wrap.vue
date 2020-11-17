<template>
    <div class='node-wrap'>
        <!-- 节点 -->
        <node-wrap-box :node.sync='node' :design='design' @delNode='delNode'></node-wrap-box>
        <!-- 点击按钮 -->
        <add-node-btn :node='node' @addNode='addNode'></add-node-btn>
    </div>
</template>

<script>
    import NodeWrapBox from './node-wrap-box.vue'
    import AddNodeBtn from '../addBtn/add-node-btn.vue'
    export default {
        name: '',
        components: {
            AddNodeBtn,
            NodeWrapBox
        },
        data(){
            return {}
        },

        props: ['node', 'design'],

        created(){},

        methods: {
            // 新增节点
            addNode(node) {
                this.$emit('addNode', node)
            },
            // 删除节点
            delNode() {
                this.$emit('delNode')
            }
        },

        mounted(){}
    }
</script>
