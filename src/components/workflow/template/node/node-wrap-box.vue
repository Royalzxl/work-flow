<template>
    <div :class="['node-wrap-box', node.type === 'start' ? 'node_sid-startevent start-node' : '']" @click="setPerson">
        <div class="title" :style="{'background': titleBg}">
            <span>{{node.name}}</span>
            <Icon v-if="node.type !== 'start'" type="ios-close" class="icon-1 close" @click.stop="delNode"></Icon>
        </div>
        <div class="content">
            <div class="text" :style="{'color': node.properties.people.length > 0 ? '' : '#979797'}">{{arr2String}}</div>
            <Icon type="ios-arrow-forward" class="icon-2"></Icon>
        </div>

        <!-- 抽屉弹窗 设置相对应的数据 -->
        <component
            :is="iscomp"
            :show.sync="show"
            :design="design"
            :node.sync="node"
            :count="step"
            @doSomething="doSomething"
            @statusChange="statusChange">
        </component>
    </div>
</template>

<script>
    import StartPersonModal from '../../components/modal/start-person-modal.vue'
    import NotifierModal from '../../components/modal/notifier-modal.vue'
    import ApproverModal from '../../components/modal/approver-modal.vue'
    export default {
        name: '',
        components: {
            StartPersonModal,
            NotifierModal,
            ApproverModal
        },
        data(){
            return {
                show: false,
                component: '',
                step: 0
            }
        },

        props: ['node', 'design'],

        computed: {
            // 处理背景颜色
            titleBg() {
                let color = null;
                if(this.node.type == 'start') color = '#5497D6'
                if(this.node.type == 'approver') color = '#30CC71'
                if(this.node.type == 'notifier') color = '#FFBA00'
                return color
            },

            // 数组转字符串并去掉最后一个字符','
            arr2String() {
                let str = ''
                if(this.node.properties.people.length > 0) {
                    this.node.properties.people.forEach(element => {
                        str += (element.title || element.name ) + '、'
                    });
                } else {
                    str = "请选择,"
                    if(this.node.properties.personType == '1') str = '发起人自己。'
                    if(this.node.properties.personType == '4') str = '发起人自选。'
                    if(this.node.type == 'start') str = '所有人。'
                }

                if(this.node.type == 'notifier' && this.node.properties.isArrow) str = '发起人自选。'

                // 特殊处理审批人
                if(this.node.properties.personType == '2' || this.node.properties.personType == '3') {
                    let type = null
                    if(this.node.properties.approverType == "1") type = '依次审批'
                    if(this.node.properties.approverType == "2") type = '会签'
                    if(this.node.properties.approverType == "3") type = '或签'
                    // 角色
                    if(this.node.properties.personType == '2'){
                        str = str.slice(0, str.length - 1)
                        str += ` ${type}。`
                    }
                    // 指定成员
                    if(this.node.properties.personType == '3'){
                        let index = str.indexOf('、'),
                            len = this.node.properties.people.length
                        str = str.slice(0, index)
                        str += ` 等${len}人 ${type}。`
                    }
                }
                
                return str.slice(0, str.length - 1)
            },

            iscomp() {
                return this.component
            }
        },

        watch: {
            node: {
                handler(val) {},
                deep: true
            }
        },

        created(){},

        methods: {
            // 删除节点
            delNode() {
                this.$emit('delNode')
            },
            // 打开弹窗设置相应的数据
            setPerson() {
                this.component = this.node.type == 'start' ? 'StartPersonModal' : this.node.type == 'approver' ? 'ApproverModal' : 'NotifierModal'
                this.$nextTick().then(() => {
                    this.show = true,
                    this.step += 1
                })
            },

            // 更新数据
            doSomething(action, data, type) {
                if(action != 'cancel') {
                    if(type == 'start' || type == 'approver')
                        this.$set(this.node.properties, 'tableListSet', data.tableListSet)
                    if(type == 'start')
                        this.$set(this.node.properties, 'otherPeople', data.otherPeople)
                    if(type=='approver'){

                        this.$set(this.node.properties, 'personType', data.personType)
                        this.$set(this.node.properties, 'approverType', data.approverType)
                    }

                    this.$set(this.node.properties, 'people', data.people)
                    
                    this.$nextTick().then(() => {
                        this.$emit('update:node', this.node)
                    })
                }
                this.show = false
            },

            // 控制 显示状态
            statusChange(e, type) {
                if(e === false) this.show = false;
            },
        },

        mounted(){}
    }
</script>
