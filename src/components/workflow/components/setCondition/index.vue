<template>
    <div class='set-condition'>
        <div class="tip" v-if="showTip">
            <div class="tip-item">
                <i class="icon icontixing color"></i>
                <span>当审批单同时满足以下条件时进入此流程</span>
            </div>
            <div class="tip-item">
                <span class="span-color" @click="showTip = false">我知道了</span>
            </div>
        </div>

        <!-- 条件显示容器 -->
        <div class="condition-content">
            <ul class="condition-rule-list" v-if="conditionsRules && conditionsRules.length > 0">
                <li class="condition-rule-list-item" v-for="(item, index) in conditionsRules" :key="index">
                    <!-- 条件 -->
                    <condition-rule :condition.sync="item" @remove="remove(index)"></condition-rule>
                </li>
            </ul>
        </div>

        <!-- 添加条件按钮 -->
        <div class="add-btn">
            <div class="add-btn-item btn">
                <Button type="primary" @click="addConditionRules">+添加条件</Button>
                <span class="btn-span">还剩{{num}}个条件</span>
            </div>
            <div class="add-btn-item tips" v-if="false">
                <Poptip trigger="hover" placement="bottom-end">
                    <div class="title">
                        <i class="icon iconwenti"></i>
                        如何添加更多条件
                    </div>
                    <template v-slot:content>
                        <!-- 内容展示 先隐藏 -->
                    </template>
                </Poptip>
            </div>
        </div>

        <!-- 添加条件弹窗 --->
        <add-condition-modal
            :show="show"
            :count="step"
            :checked="checked"
            :options="list"
            @doSomething="doSomething"
            @statusChange="statusChange">
        </add-condition-modal>
        
    </div>
</template>

<script>
    import { ObjDeepCopy, CreateRule, MinusCheck} from '../../script/uitls'
    import ConditionRule from './condition-rule.vue'
    import AddConditionModal from '../modal/add-condition-modal.vue'
    export default {
        name: '',
        components: {
            ConditionRule,
            AddConditionModal
        },
        data(){
            return {
                showTip: true,
                step: 0,
                // 标识还剩几个可用条件
                show: false,
                // 深度拷贝新增弹窗里面的选中内容
                conditionsRules: ObjDeepCopy(this.conditionsRuleList),
            }
        },

        props: ['conditionsRuleList', 'design'],

        computed: {
            // 条件总条数
            list() {
                // 明细控件不作为条件设置
                let tempList = [
                    {
                        id: 'start_people',
                        name: '发起人',
                        type: 'start'
                    }
                ]
                let dataList = this.design.list.filter(item => item.required == true)
                dataList.forEach(element => {
                    let temp = {}
                    temp.id = element.id
                    temp.name = element.type == 'DateRange' ? `${element.duration}(${element.unit})` : element.title
                    temp.type = element.type

                    if(element.type == 'Radio' || element.type == 'Checkbox') {
                        temp.options = element.options
                    }

                    tempList.push(temp)
                })
                return tempList
            },
            // 已选中的数据
            checked() {
                let tempList = []
                this.conditionsRules.forEach(element => {
                    let temp = {}
                    temp.id = element.createdId
                    temp.name = element.paramLabel
                    temp.type = element.createdType

                    if(element.createdType == 'Radio' || element.createdType == 'Checkbox') {
                        temp.options = element.oriValue
                    }

                    tempList.push(temp)
                })
                return tempList
            },

            // 剩余几个条件
            num() {
                return this.list.length - this.checked.length
            }
        },

        watch: {
            conditionsRuleList: {
                handler(val) {
                    val && (this.conditionsRules = ObjDeepCopy(val))
                },
                deep:true
            },

            conditionsRules: {
                handler(val) {
                    this.$emit('setData', val)
                },
                deep: true
            }
        },

        created(){},

        methods: {
            // 添加条件规则
            addConditionRules() {
                this.step += 1
                this.show = true
            },

            // 移除该条数据
            remove(index) {
                this.conditionsRules.splice(index, 1)
            },

            // 更新数据
            doSomething(type, data) {
                if(type != 'cancel') {
                    let list = []
                    data.forEach(el => list.push(CreateRule(el)))
                    if(this.conditionsRules.length == 0) this.conditionsRules = list
                    else {
                        
                        MinusCheck(list, 3 ,this.conditionsRules)
                        
                        this.conditionsRules = [...this.conditionsRules, ...list].reduce((all,next) => all.some(item => item.createdId== next.createdId) ? all : [...all,next],[])
                    }
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
    .set-condition{
        .tip{
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 20px 0;
            line-height: 45px;
            background: rgba(241, 249, 255, 1);
            border: 1px solid rgba(64, 163, 247, 1);
            color: #46a6fe;
            font-size: 14px;
            .tip-item{
                text-align: center;
                .color{
                    color: red;
                    font-size: 14px;
                }
                .span-color{
                    cursor: pointer;
                    color: #008fe0;
                }
            }
        }
        .add-btn{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .btn{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .btn-span{
                    display: block;
                    margin-left: 10px;
                    color: rgba(25,31,37,.56);
                }
            }
            .tips{
                .title{
                    font-size: 16px;
                    cursor: pointer;
                    color: #576a95;
                }
            }
        }
    }

</style>
