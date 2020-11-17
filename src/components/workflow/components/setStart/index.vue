<template>
    <div class='set-start-person'>
        <div class="set-start-person-title">谁有提交权限</div>
        <div class="set-start-person-body">
            <div class="check-box">
                <Checkbox v-model="allPerson">所有人</Checkbox>
            </div>
            <div class="tips" :class="{'disabled': allPerson}">
                请选择可提交部门或人员
                <Button class="add" @click.stop="openModal(1)">+添加</Button>
            </div>
            <name-body v-if="!allPerson" :list="list" @remove="remove($event, 1)" @clear="clear(1)"></name-body>
        </div>
        <!-- <div class="set-start-person-body">
            <div class="check-box">
                <Checkbox v-model="isArrow">允许代他人提交</Checkbox>
            </div>
            <div class="tips" :class="{'disabled': !isArrow}">
                请选择可代他人提交人员
                <Button class="add" @click.stop="openModal(2)">+添加</Button>
            </div>
            <name-body v-if="isArrow" :list="list1" @remove="remove($event, 2)" @clear="clear(2)"></name-body>
        </div> -->
        <!-- 设置发起人及可代他人提交人员 -->
        <set-people-modal
            :name="modalList.length > 1 ? '请选择可提交部门或人员' : '请选择可代他人提交人员'"
            :show="show"
            :count="step"
            :delData.sync="delData"
            :type="modalList.length > 1 ? 1 : 2"
            :modalType="modalList"
            :dataList="dataList"
            @doSomething="doSomething"
            @statusChange="statusChange">
        </set-people-modal>
    </div>
</template>

<script>
    import SetPeopleModal from '../modal/set-people-modal.vue'
    import NameBody from '../common/name-body.vue'
    export default {
        name: '',
        components: {
            NameBody,
            SetPeopleModal
        },
        data(){
            return {
                allPerson: true,
                isArrow: false,
                show: false,
                list: [],
                list1: [],
                delData: {},
                modalList: [
                    { name: '按部门', type: 'department', key: 2 }, 
                    // { name: '按角色', type: 'role', key: 1 },
                    { name: '按人员', type: 'people', key: 1 }
                ],
                dataList: [],
                step: 0
            }
        },

        props: ['people', 'otherPeople'],

        watch: {
            people: {
                handler(val) {
                    this.list = val
                    val.length > 0 ? this.allPerson = false : this.allPerson = true
                    this.delData = null
                },
                deep:true
            },

            otherPeople: {
                handler(val) {
                    this.list1 = val
                    val.length > 0 ? this.isArrow = true : this.isArrow = false
                },
                deep:true
            },
            allPerson: {
                handler(val) {
                    if(val) this.$emit('setData', this.list, this.list1, val, this.isArrow)
                }
            },
            isArrow: {
                handler(val) {
                    if(val) this.$emit('setData', this.list, this.list1, this.allPerson, val)
                }
            }
        },

        created(){},

        methods: {
            // 移除当前选项
            remove(evt, type) {
                this.delData = evt.data
                let list = type == 1 ? this.list : this.list1
                // 处理chosenData
				if(this.delData.length > 0) {
                    this.delData.children.forEach(el => {
                        list = list.filter(item => item.id != el.id)
                    })
                    list = list.filter(item => item.id != this.delData.id)
                } else {
                    list.splice(evt.index, 1)
                    list = list.filter(item => item.id != this.delData.parentId)
                }
                type == 1 ? this.list = list : this.list1 = list
                this.$emit('setData', this.list, this.list1, this.allPerson, this.isArrow)
            },

            // 清空选项
            clear(type) {
                type == 1 && (this.list = [])
                type == 2 && (this.list1 = [])
               this.$emit('setData', this.list, this.list1, this.allPerson, this.isArrow)
            },

            // 打开人员设置弹窗
            openModal(type) {
                // { name: '按角色', type: 'role', key: 1 },
                let data = [{ name: '按部门', type:'department', key: 2 }, { name: '按人员', type: 'people', key: 1 }],
                    data_1 = [{ name: '按人员', type: 'people', key: 1 }]
                if(type == 2) {
                    this.dataList = this.list1
                    this.modalList = data_1
                } else {
                    this.dataList = this.list
                    this.modalList = data
                }
                this.step++
                this.show = true
            },

            // 更新数据
            doSomething(type, data, action) {
                if(type != 'cancel') {
                    if(action == 1) this.list = data
                    else this.list1 = data
                    
                    // 数据传出去 赋值
                   this.$emit('setData', this.list, this.list1,this.allPerson, this.isArrow)
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

<style lang='less' scoped>
    .disabled{
        color: #ccc !important;
        pointer-events: none;
        .ivu-btn{
            color: #ccc;
            border-color: #ccc;
        }
    }
    .set-start-person-title{
        color: #333;
        font-weight: bold;
        margin-bottom: 15px;
    }
    .set-start-person-body{
        margin-bottom: 10px;
        .check-box label, .tips{
            color: #666;
            font-weight: bold;
        }
        .add{
            height: 26px;
            margin-left: 10px;
        }
    }
</style>
