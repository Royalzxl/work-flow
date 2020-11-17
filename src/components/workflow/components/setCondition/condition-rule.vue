<template>
    <div class='condition-rule'>
        <div class="left">
            <div class="label">{{condition.paramLabel}}</div>
            <!-- 发起人 -->
            <template v-if="condition.type == 'condition_dept'">
                <div class="imitate-input">
                    <div class="imitate-input-content" :class="{'imitate-input-focus': isfocus}" tabindex="-1" @focus="isfocus=true" @blur="isfocus=false" @click="addPeople">
                        <ul v-if="condition.person.length > 0">
                            <li v-for="(item, index) in condition.person" :key="index">
                                <p>{{item.title || item.name}}</p>
                                <p @click.stop="del(index)"><i class="icon iconzengjia"></i></p>
                            </li>
                        </ul>
                        <div class="placeholder" v-else @click="addPeople">请选择具体的人员/部门</div>
                    </div>
                    
                    <!-- 新增发起人 -->
                    <set-people-modal 
                        :show="isshow"
                        :count="step"
                        :modalType="modalList"
                        :dataList="condition.person"
                        @doSomething="doSomething"
                        @statusChange="statusChange">
                    </set-people-modal>
                </div>
            </template>

            <!-- 单选框 -->
            <template v-if="condition.type == 'condition_value'">
                <Row class="condition-content">
                    <Col span="8" style="padding-right:10px">
                        <Select v-model="condition.key">
                            <Option value="0">属于</Option>
                        </Select>
                    </Col>
                    <Col span="16">
                        <Select v-model="condition.paramValues" multiple>
                            <Option v-for="(item,index) in condition.oriValue" :value="item.key" :key="index">{{ item.value }}</Option>
                        </Select>
                    </Col>
                </Row>
            </template>

            <!-- 数字输入框|计算公式|日期区间 -->
            <template v-if="condition.type == 'condition_range'">
                <Row class="condition-content">
                    <Col :span="condition.key == '5' ? '24' : '12'" :style="condition.key == '5' ? '' : 'padding-right:10px'">
                        <Select v-model="condition.key">
                            <Option v-for="(item, index) in rangeList" :value="`${index}`" :key="index">{{item}}</Option>
                        </Select>
                    </Col>
                    <Col :span="condition.key == '5' ? '24' : '12'">
                        <!-- 介于(两者之间) -->
                        <div class="between" v-if="condition.key == '5'">
                            <InputNumber class="between-item" v-model="condition.valueUpper"></InputNumber>
                            <Select class="between-item" v-model='condition.betweenUpper'>
                                <Option value="0" label="≤"></Option>
                                <Option value="1" label="<"></Option>
                            </Select>
                            <div class="label between-item">{{condition.paramLabel}}</div>
                            <Select class="between-item" v-model='condition.betweenLower'>
                                <Option value="0" label="≤"></Option>
                                <Option value="1" label="<"></Option>
                            </Select>
                            <InputNumber class="between-item" v-model="condition.valueLower"></InputNumber>
                        </div>
                        <!-- 其他情况 -->
                        <div class="except-between" v-else>
                            <InputNumber v-model="condition.value"></InputNumber>
                        </div>
                    </Col>
                </Row>
            </template>

            <!-- 多选框 -->
            <template v-if="condition.type == 'condition_multi'">
                <Row class="condition-content">
                    <Col span="8" style="padding-right:10px">
                        <Select v-model="condition.key">
                            <Option value="0">完全等于</Option>
                            <Option value="1">包含任意</Option>
                        </Select>
                    </Col>
                    <Col span="16">
                        <Select v-model="condition.paramValues" multiple>
                            <Option v-for="item in condition.oriValue" :value="item.key" :key="item.key">{{ item.value }}</Option>
                        </Select>
                    </Col>
                </Row>
            </template>
        </div>

        <!-- 删除图标 -->
        <div class="remove" @click="remove"><i class="icon iconshanchu"></i></div>
    </div>
</template>

<script>
    import SetPeopleModal from '../modal/set-people-modal.vue'
    export default {
        name: '',
        components: {
            SetPeopleModal
        },
        data(){
            return {
                isfocus: false,
                isshow: false, // 新增发起人弹窗显示隐藏
                step: 0,
                rangeList: [
                    "小于" , "小于等于", "等于", "大于", "大于等于", "介于(两者之间)" 
                ],
                modalList: [
                     {
                        name: '按人员',
                        type: 'people',
                        key: 1
                    },
                    {
                        name: '按部门',
                        type: 'department',
                        key: 2
                    }
                ]
            }
        },

        props: ['condition'],

        watch: {},

        created(){},

        methods: {
            // 删除发起人
            del(index) {
                this.condition.person.splice(index, 1)
            },

            // 添加发起人弹窗
            addPeople() {
                let data = [
                    {
                        name: '按人员',
                        type: 'people',
                        key: 1
                    },
                    {
                        name: '按部门',
                        type: 'department',
                        key: 2
                    }
                ]
                this.modalList = data
                this.step += 1   
                this.isshow = true
            },

            // 更新数据
            doSomething(type, data) {
                if(type != 'cancel'){
                    this.$set(this.condition, 'person', data)
                }
                this.isshow = false
            },

            // 移除当前数据
            remove() {
                this.$emit('remove')
            },

            // 控制弹窗显示隐藏
            statusChange(e) {
                !e && (this.isshow = false)
            }
        },

        mounted(){}
    }
</script>

<style lang='less'>
    .condition-rule{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
        .left{
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            .label{
                width: 100px;
                margin-right: 10px;
            }

            .imitate-input{
                flex: 1;
                .imitate-input-content{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    border: 1px solid #eee;
                    border-radius: 4px;
                    cursor: pointer;
                    &.imitate-input-focus, &:hover{
                        border-color: #57a3f3;
                        outline: 0;
                        box-shadow: 0 0 0 2px rgba(45,140,240,.2)
                    }
                    ul{
                        display: flex;
                        flex-wrap: wrap;
                        padding: 3px;
                        li{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 2px 5px;
                            border: 1px solid #eee;
                            border-radius: 4px;
                            margin: 0 10px 10px 0;
                            p{
                                &:last-child{
                                    cursor: pointer;
                                    margin-left: 5px;
                                    .icon{
                                        display: block;
                                        transform: rotate(45deg);
                                        font-size: 12px;
                                    }
                                }
                            }
                        }
                    }
                    .placeholder{
                        flex: 1;
                        cursor: pointer;
                        padding: 5px;
                        color: #aaa;
                    }
                }
                
            }

            .condition-content{
                flex: 1;
                .between{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-top: 10px;
                    .between-item{
                        flex: 1;
                        margin-right: 5px;
                        text-align: center;
                        &:last-child{
                            margin-right: 0;
                        }
                        .ivu-select-placeholder{
                            width: 40px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        &.label{
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .except-between{
                    .ivu-input-number{
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
        .remove{
            width: 16px;
            margin-left: 10px;
            cursor: pointer;
        }
    }
</style>
