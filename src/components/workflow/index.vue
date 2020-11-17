<template>
    <div class='workflow'>
        <div class="zoom">
            <div :class="['zoom-out', newZoom == 50 ? 'disabled' : '' ]" @click="zoomSize(1)">
                <Icon type="md-remove" class="icons"/>
            </div>
            <span>{{newZoom}}%</span>
            <div :class="['zoom-in', newZoom == 300 ? 'disabled' : '' ]" @click="zoomSize(2)">
                <Icon type="md-add" class="icons"/>
            </div>
        </div>
        <div class="ie-polyfill-container">
            <div class="box-scale" id="box-scale" :style="'transform: scale('+newZoom/100+'); transform-origin: 50% 0px 0px;'">
                <!-- 流程开始 -->
                <node 
                    v-for='(item, index) in nodeList'
                    :key='index'
                    :node.sync='nodeList[index]'
                    :data.sync='node'
                    :design='design'
                    :list.sync='nodeList'
                    :conditionsList.sync='conditionsList'
                    @addNode='addNode'
                    @delNode='delNode(item)'>
                </node>
                <!-- 流程结束 -->
                <div class="end-node">
                    <div class="end-node-circle"></div>
                    <div class="end-node-text">流程结束</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { IteratorData, AddNewNode, RemoveNode } from './script/uitls'
    export default {
        name: 'work-flow',
        components: {},
        data(){
            return {
                // 放大缩小百分比
                newZoom: 100,
                // nodeList 首层节点列表
                nodeList: [],
                startData: {}
            }
        },

        props: ['node', 'design', 'conditionsList'],

        watch: {
            node: {
                handler(val) {
                    if(val) {
                        this.$emit('update:node', val)
                        this.iteratorData()
                    }
                },
                deep: true,
            }
        },

        created(){},

        methods: {
            // 放大缩小界面
            zoomSize(type) {
                switch (type) {
                    case 1:
                        if(this.newZoom == 50) return
                        this.newZoom -= 10
                        break;
                    case 2:
                        if(this.newZoom == 300) return
                        this.newZoom += 10
                        break;
                }
            },

            // 新增节点
            addNode(node) {
                AddNewNode(node, this.node, this.nodeList)
                this.$emit('update:node', this.node)
            },

            // 删除节点
            delNode(node) {
                RemoveNode(node, this.node, this.nodeList)
                this.$emit('update:node', this.node)
            },

            // 初始化构造数据
            iteratorData() {
                this.nodeList = []
                if(this.node) {
                    IteratorData(this.nodeList, this.node)
                } else {
                    this.startData = {
                        type: 'start',
                        name: '发起人',
                        properties: {
                            people: []
                        },
                        nodeId: 'sid-startevent',
                    }
                    this.$emit('update:node', this.startData)
                }
            }
        },

        mounted(){
            this.iteratorData()
        }
    }
</script>

<style lang='less' src='./style.less'></style>
