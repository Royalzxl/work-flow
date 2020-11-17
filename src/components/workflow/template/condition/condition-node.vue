<template>
    <div class="condition-node">
        <div class="condition-node-box">
            <div class="auto-judge" @click="setPerson">
                <!--向右改变顺序-->
                <div class="sort-left" v-if="index != 0" @click.stop="permutation(index, -1)">
                    <Icon type="ios-arrow-back" class="icon-sort"/>
                </div>
                <!--向左改变顺序-->
                <div class="sort-right" v-if="index != len" @click.stop="permutation(index)">
                   <Icon type="ios-arrow-forward" class="icon-sort"/>
                </div>
                <!--移除按钮-->
                <Icon type="ios-close" class="close" @click.stop="delConditionNode"></Icon>
                <!--标题-->
                <div class="title-wrapper">
                    <div class="title-inner" v-if="isInputList[index]">
                        <input type="text" class="ant-input editable-title-input"
                        @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-focus v-model="node.name">
                    </div>
                    <div class="title-inner" v-if="!isInputList[index]">
                        <span class="editable-title" @click="clickEvent(index)">{{node.name}}</span>
                        <span class="priority-title" @click="setPerson(node.priorityLevel)">优先级{{node.priorityLevel}}</span>
                    </div>
                </div>
                <!--内容-->
                <div class="content">{{conditionStr}}</div>
                <!-- <div class="error_tip" v-if="isTried&&item.error">
                    <Icon custom="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></Icon>
                </div> -->
            </div>
            <!-- 添加节点按钮 -->
            <add-node-btn :node="node" @addNode='addNode'></add-node-btn>
        </div>

        <!-- 抽屉弹窗 设置相对应的数据 -->
        <condition-modal 
            :show="show"
            :count="step"
            :node.sync="node"
            :design="design"
            :length="length"
            @doSomething="doSomething"
            @statusChange="statusChange">
        </condition-modal>
    </div>
</template>

<script>
    import AddNodeBtn from '../addBtn/add-node-btn.vue'
    import ConditionModal from '../../components/modal/condition-modal.vue'
    export default {
        name: '',
        components: {
            AddNodeBtn,
            ConditionModal
        },
        data(){
            return {
                isInputList: [],
                show: false,
                step: 0
            }
        },

        props: ['node', 'index', 'length', 'design', 'conditionsList'],

        computed: {
            // 改变顺序
            len() {
                if(this.length) return this.length - 1
            },

            // 显示条件
            conditionStr() {
                let Str = ''
                this.node.properties.conditionsRules.forEach(element => {
                    let str = ` ${element.paramLabel}属于：`
                    // 发起人
                    if(element.type == 'condition_dept'){
                        let people = ''
                        element.person.forEach(el => {
                            people += `${el.title||el.name}、`
                        })

                        // 处理尾部
                        people = people.slice(0, people.length - 1)

                        str += people
                    }
                    // 区间
                    if(element.type == 'condition_range'){
                        let range = '',
                            flag = ''
                        str = ' '
                        if(element.key == 0) flag = '<'
                        if(element.key == 1) flag = '≤'
                        if(element.key == 2) flag = '='
                        if(element.key == 3) flag = '>'
                        if(element.key == 4) flag = '≥'
                        if(/[0-4]/.test(element.key)) {
                            range = element.paramLabel + flag + element.value
                        }
                        if(element.key == 5) {
                            let left = element.betweenUpper == 0 ? '≤' : '<',
                                right = element.betweenLower == 0 ? '≤' : '<'
                            
                            range = element.valueUpper + left + element.paramLabel + right + element.valueLower
                        }

                        str += range
                    } 
                    // 单选
                    if(element.type == 'condition_value'){
                        let val = ''
                        element.oriValue.forEach(el => {
                            element.paramValues.forEach(ele => {
                                if(el.key == ele) {
                                    val += `${el.value}或`
                                }
                            })
                        })
                        
                        // 处理尾部
                        val = val.slice(0, val.length - 1)

                        str += val
                    } 
                    // 多选
                    if(element.type == 'condition_multi'){
                        let val = '',
                            flag = element.key == 0 ? '完全等于：' : '包含任意：'
                        
                        str = ` ${element.paramLabel}` + flag

                        element.oriValue.forEach(el => {
                            element.paramValues.forEach(ele => {
                                if(el.key == ele) {
                                    val += `${el.value}或`
                                }
                            })
                        })
                        
                        // 处理尾部
                        val = val.slice(0, val.length - 1)

                        str += val
                    }
                    
                    Str += `${str} 并且`
                })

                // 处理尾部
                Str = Str.slice(0, Str.length - 2)

                return Str
            },
        },

        created(){},

        methods: {
            // 新增节点
            addNode(node) {
                this.$emit('addNode', node)
            },

            // 排列 改变分支顺序 type -1向左, 1向右
            permutation(index, type = 1) {
                this.$emit('permutation', index, type)
            },

            blurEvent() {
                // @TODO
            },

            clickEvent() {
                // @TODO
            },

            // 打开弹窗
            setPerson() {
                this.step += 1
                this.show = true
            },
            
            // 移除分支节点
            delConditionNode() {
                this.$emit('delConditionNode')
            },

            // 属性数据处理
            doSomething(type, config, list) {
                this.show = false
                if(type != 'cancel') {
                    if(this.node.priorityLevel != config.priorityLevel) 
                        this.$emit('addConditionFactor', this.node.priorityLevel, config.priorityLevel) 
                    else {
                        this.$set(this.node.properties, 'conditionsRules', list)
                        // 处理数据
                        let data_list = []
                        list.forEach(el => {
                            data_list.push(el.createdId)
                        })
                        this.$set(this.conditionsList, this.node.nodeId, data_list)
                    } 
                }
            },

            // 控制 显示状态
            statusChange(e, type) {
                if(e === false) this.show = false;
            },
        },

        mounted(){}
    }
</script>
