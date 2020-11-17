<template>
    <div class='set-approver'>
        <!-- 类型选择 -->
        <div class="set-approver-content">
            <RadioGroup :value="tempPersonType" @on-change="getPersonType">
                <Radio v-for='(item, index) in personDataType' :key="index" :label="item.id">{{item.name}}</Radio>
            </RadioGroup>
        </div>
        <!-- 人员设置 -->
        <div class="set-approver-content set-item" v-if="tempPersonType != 1 && tempPersonType != 4">
            <div class="add">
                <Button type="primary" ghost @click.stop="add">+添加{{addSet}}</Button>
            </div>
            <name-body v-if="list && list.length > 0" :list="list" @remove="remove" @clear="clear"></name-body>
        </div>
        <!-- 审批方式选择 -->
        <div class="set-approver-content set-item" v-if="tempPersonType != 1">
            <div class="set-mode">多人审批时审批方式选择</div>
            <RadioGroup :value="tempApproverType" @on-change="getApproverType">
                <Radio v-for='(item, index) in approverDataType' :disabled="item.disabled ? item.disabled : false" :key="index" :label="item.id">
                    {{item.name}}
                    <Tooltip v-if="index == 0" placement="top-start" max-width="300">
                        <i class="icon iconwenti"></i>
                        <template v-slot:content>
                            <p>当此节点为依次审批时，审批顺序为添加的顺序，然后角色里为多人时，审批顺序为当初添加人到此角色的先后顺序。</p>
                        </template>
                    </Tooltip>
                </Radio>
            </RadioGroup>
        </div>
        <!-- 人员选择弹窗 -->
        <set-people-modal
            :show="show"
            :count="step"
            :delData.sync="delData"
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
                tempPersonType: this.personType,
                tempApproverType: this.approverType,
                personDataType: [
                    {
                        id: '1',
                        name: '发起人自己'
                    },
                    {
                        id: '2',
                        name: '角色'
                    },
                    {
                        id: '3',
                        name: '指定成员'
                    },
                    {
                        id: '4',
                        name: '发起人自选'
                    }
                ],
                list: ObjDeepCopy(this.people),
                delData: {},
                step: 0
            }
        },

        props: {
            people: {
                type: Array,
                default: function() {
                    return []
                }
            }, 
            personType: {
                type: [Number, String],
                default: '1'
            },
            approverType: {
                type: [Number, String],
                default: '1',
            }
        },

        computed: {
            // 按钮文字
            addSet() {
                return this.tempPersonType == 1 ? '发起人' : 
                    this.tempPersonType == 2 ? '角色' : '指定成员'
            },
            // 弹窗内部组件生成数据
            modalList() {
                return this.tempPersonType == 1 ? [{type: 'people', key: 1}] : 
                    this.tempPersonType == 2 ? [{type: 'role', key: 2}] :  [{type: 'people', key: 1}]
            },

            // 控制审批类型
            approverDataType() {
                let approverDataType = [
                    { id: '1', name: '依次审批' },
                    { id: '2', name: '会签(需所有审批人同意)' },
                    { id: '3', name: '或签(一名审批人同意或拒绝即可)' }
                ]
                if(this.tempPersonType == 2) {
                    approverDataType.push(approverDataType.splice(0, 1)[0])
                    approverDataType[2].disabled = true
                }
                return approverDataType
            }  
        },

        watch: {
            people: {
                handler(val) {
                    this.list = ObjDeepCopy(val)
                    this.delData = null
                },
                deep: true,
            }
        },

        created(){},

        methods: {

            // 获取当前人员类型选中
            getPersonType(val) {
                this.tempPersonType = val
                if(val == '2') this.tempApproverType = '2'
                else this.tempApproverType = '1'
                this.$emit('setTemp', 'personType', val)
                this.$emit('setTemp', 'approverType', this.tempApproverType)
                this.clear(this.tempApproverType)
            },

            // 获取当前人员类型选中
            getApproverType(val) {
                this.tempApproverType = val
                this.$emit('setTemp', 'approverType',val)
            },


            // 移除当前选项
            remove(evt) {
                this.delData = evt.data
                this.list.splice(evt.index, 1)
                // 数据改变 就需要传出去
                this.$emit('setData', this.list)
            },

            // 清空选项
            clear() {
               this.list = []
               // 数据改变 就需要传出去
               this.$emit('setData', this.list)
            },
            
            // 添加人员(打开弹窗)
            add() {
                this.step ++
                this.show = true
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
    .set-approver{
        .set-approver-content{
            .add, .set-mode{
                margin-bottom: 16px;
            }
            &.set-item{
                border-top: 1px solid #dcdee2;
                padding-top: 16px;
                margin: 16px 0;
                .ivu-radio-group{
                    display: block;
                    label{
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin-bottom: 10px;
                        vertical-align: middle;
                        .icon{
                            color: #5497D6;
                        }
                    }
                }
                .ivu-tooltip-popper{
                    font-size: 12px;
                    .ivu-tooltip-inner-with-width{
                        white-space: pre-line;
                    }
                }
            }
        }
    }

</style>
