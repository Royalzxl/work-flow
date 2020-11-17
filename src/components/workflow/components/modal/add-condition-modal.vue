<template>
    <Modal 
        class="workflow-modal" 
        width="400"
        :value="show"
        @on-visible-change="getModalStatusChange">
        <!-- 标题 -->
        <template v-slot:header>
            <div class="header add-header">条件选择</div>
        </template>
        <div class="content add-content">
            <div class="content-item">
                <div class="tips">请选择用来区分审批流程的条件字段，已选{{chosenData.length}}个</div>
                <multi-check :options="options" :checked="checked" :showlabelicon="false" @change="getSelectData"></multi-check>
            </div>
        </div>
        <!-- 底部点击按钮 -->
        <template v-slot:footer>
            <div class="footer">
                <Button type="text" @click="doSomething('cancel')">取消</Button>
                <Button type="primary" @click="doSomething('submit')">确定</Button>
            </div>
        </template>
    </Modal>
</template>

<script>
    import MultiCheck from '../common/multi-check.vue'
    export default {
        name: '',
        components: {
            MultiCheck
        },
        data(){
            return {
                chosenData: this.checked
            }
        },

        props: ['show', 'options', 'checked', 'count'],

        watch: {
            count: {
                handler(val) {
                    if(val) {
                        this.chosenData = this.checked
                    }
                }
            }
        },

        created(){},

        methods: {
            // 点击确认事件
            doSomething(type) {
                this.$emit('doSomething', type, this.chosenData)
            },

            // 获取Select 中选中数据
            getSelectData(val) {
                this.chosenData = val
            },

            // 状态控制
            getModalStatusChange(e){
                this.$emit("statusChange", e);
            }
        },

        mounted(){}
    }
</script>

