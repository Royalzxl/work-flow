<template>
    <div class="multi-checklist">
        <div v-if=" options && options.length > 0">
            <label v-if="label" class="multi-checklist-title">{{label}}</label>
            <div :class="showbox ? 'multi-checklist-contentc':'multi-checklist-content'">
                <div class="option-item" v-for="(item,index) in options" :key="index">
                    <div v-if="type">
                        <input type="checkbox" :id="'mchecklist'+index+curTime" :value="item" v-model="checkedVal"
                            class="checkbox" :disabled="item.disabled || disabled">
                        <label :for="'mchecklist'+index+curTime" class="check-label">
                            <i class="icon icontianjiarenyuan color" v-if="showlabelicon"></i>
                            {{item.name}}
                        </label>
                    </div>
                    <div v-if="!type">
                        <input type="radio" :id="'mchecklist'+index+curTime" :value="item" v-model="checkedVal"
                            class="checkbox" :disabled="item.disabled || disabled">
                        <label :for="'mchecklist'+index+curTime" class="check-label">
                            <i class="icon icontianjiarenyuan color" v-if="showlabelicon"></i>
                            {{item.name}}
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty" v-else>暂无数据(需请求接口获取数据)</div>
    </div>
</template>

<script>
    /**
     * @author Royalzxl
     * @description 多选操作 结果是数组，读取value值
     * @param  label：组件的标签名称
     * @param  options：选项 [{value:'1',name:'选项1',disabled:false}] value:选中的值  name:checkbox显示的名称  disabled:禁用控件，默认不禁用
     * @param  checked：选中的数据 ['1']，通常与disabled:true合并使用
     * @param  disabled：是否全部禁用， 默认false可用
     * @param  showbox：是否显示勾选框， 默认显示 ( false:不显示，则样式会改变)
     */
    export default {
        name: "multi-check",
        model: { // v-model  对应的变量和事件，默认是value和change
            prop: 'checked',
            event: 'change'
        },
        data() {
            return {
                checkedVal: this.checked, // 用来存储选中的数据
                curTime: new Date().getTime(), // 获取当前时间，生成唯一id，保证一个页面可使用多个组件
            }
        },
        props: { // 组件参数
            label: String,
            options: Array,
            checked: Array,
            disabled: false,
            showbox: {
                type: Boolean,
                default: true
            },
            type: {
                type: Boolean,
                default: true
            },
            showlabelicon: {
                type: Boolean,
                default: true
            }
        },
        watch: { // 监听数据变化，回传数据到父组件
            checkedVal(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.$emit('change', newValue)
                }
            },
            'checked':{
                handler(newVal,oldVal){ // 监听数据变化，改变选中状态
                    if (newVal != oldVal) {
                        this.checkedVal = newVal
                    }
                },
                deep:true
            }
        },
    }
</script>

<style scoped lang="less">
    .multi-checklist {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .option-item {
            width: 100%;
            padding: 5px 0;
        }
        .checkbox {
            display: none;
            &:disabled + .check-label, &:disabled + .check-label:before {
                opacity: .7;
            }
        }
        .empty{
            flex: 1;
            text-align: center;
            padding: 20px;
        }
    }
    .multi-checklist-title {
        width: max-content;
        max-width: 40%;
    }
    .multi-checklist-content,.multi-checklist-contentc{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .check-label {
            display: inline-block;
            padding: 2px 10px;
            height: 20px;
            line-height: 20px;
            border-radius: 3px;
            border: 1px solid #dfdfdf;
            background-color: #f2f2f2;
            i{
                color: rgba(84, 151, 214, .5);
                margin: 0 5px 0 0;
            }
        }
        .checkbox:checked + .check-label {
            border-color: #ef3e31;
        }
    }
    .multi-checklist-contentc {
        .check-label {
            position: relative;
            padding: 0 0 0 5px;
            border: none;
            background-color: transparent;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:before {
                content: '';
                width: 14px;
                height: 14px;
                display: inline-block;
                margin-right: 5px;
                text-align: center;
                line-height: 14px;
                background: white;
                border: 1px solid #cecbcb;
                border-radius: 2px;
            }
        }
        .checkbox:checked + .check-label {
            &:before {
                content: '';
                border-color: rgba(84, 151, 214, 1);
                background-color: rgba(84, 151, 214, 1);
            }
            &:after {
                content: '';
                position: absolute;
                left: 9px;
                top: 4px;
                width: 5px;
                height: 10px;
                border-right: 1.5px solid #fff;
                border-bottom: 1.5px solid #fff;
                transform: rotate(45deg);
            }
        }
    }
</style>