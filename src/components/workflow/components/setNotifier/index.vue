<template>
    <div class='set-notifier'>
        <div class="title item">抄送人</div>
        <div class="add item">
            <Button type="primary" @click="add">添加成员</Button>
            <name-body v-if="list && list.length > 0" :list="list" @remove="remove" @clear="clear"></name-body>
        </div>
        <div class="check-box item">
            <Checkbox :value="arrow" @on-change="getIsArrow">允许发起人自选抄送人</Checkbox>
        </div>
        <!-- 人员选择弹窗 -->
        <set-people-modal
            :show="show"
            :count="step"
            :modalType="modalList"
            :dataList="list"
            @doSomething="doSomething"
            @statusChange="statusChange">
        </set-people-modal>
    </div>
</template>

<script>
    import NameBody from '../common/name-body.vue'
    import SetPeopleModal from '../modal/set-people-modal.vue'
    import { ObjDeepCopy } from '../../script/uitls'
    export default {
        name: '',
        components: {
            NameBody,
            SetPeopleModal
        },
        data(){
            return {
                show: false,
                step: 0,
                modalList: [{ name: "按人员", type: 'people', key: 1}, { name: '按角色', type: 'role', key: 1 }],
                list: ObjDeepCopy(this.people),
                arrow: this.isArrow
            }
        },

        props:{
            people: {
                type: Array,
                default: []
            },
            // 是否允许
            isArrow: {
                type: Boolean,
                default: false
            }
        },

        watch: {
            people: {
                handler(val) {
                    this.list = ObjDeepCopy(val)
                },
                deep: true,
            },
            arrow: {
                handler(val) {
                    this.$emit("update:isArrow", val)
                },
                immediate: true
            },
        },

        created(){},

        methods: {
            // 移除当前选项
            remove(evt) {
                this.list.splice(evt.index, 1)
                this.$emit('setData', this.list)
            },

            // 清空选项
            clear() {
               this.list = []
               this.$emit('setData', this.list)
            },
            
            // 添加人员(打开弹窗)
            add() {
                this.step += 1
                this.show = true
            },

            // 更新状态
            getIsArrow(val) {
                this.arrow = val
            },

            // 更新数据
            doSomething(type, data) {
                if(type != 'cancel'){
                    this.list = data
                    // 数据传出去 赋值
                    this.$emit('setData', this.list)
                }
                this.show = false
            },

            // 控制弹窗显示隐藏
            statusChange(e) {
                !e && (this.show = false)
            }
        },

        mounted(){}
    }
</script>

<style lang='less'>
    .set-notifier{
        .item{
            margin-bottom: 20px;
            .ivu-checkbox-focus{
                box-shadow: none;
            }
        }
    }
</style>
