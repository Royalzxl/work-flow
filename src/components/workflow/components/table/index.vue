<template>
    <Table class="workflow-table" :columns="columns" :data="dataList" border height="500">
        <!-- 标题 -->
        <template v-slot:name="{ row }">
            <div class="workflow-table-name">
                <Icon v-if="row.necessary" type="ios-medical" class="icons"/>
                <p>{{row.name}}</p>
            </div>
        </template>
    </Table>
</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return {
                columnsBase: [
                    {
                        title: '表单字段',
                        key: 'name',
                        slot: "name",
                        width: 200,
                    },
                    {
                        key: 'doit',
                        index: 0,
                        flag: true,
                        renderHeader: this.renderHeader,
                        render: this.render
                    },
                    {
                        key: 'doit',
                        flag: false,
                        index: 1,
                        renderHeader: this.renderHeader,
                        render: this.render
                    },
                    {
                        key: 'doit',
                        flag: false,
                        index: 2,
                        renderHeader: this.renderHeader,
                        render: this.render
                    }
                ],
                designIsChange: false,
            }
        },

        props: ['design', 'tableListSet'],

        computed: {
            dataList () {
                if(this.designIsChange) return this.initData(this.design.list)
                else return this.tableListSet
            },

            columns () {
                let list = this.dataList.filter(el => el.doit == 0),
                    list1 = this.dataList.filter(el => el.doit == 1),
                    list2 = this.dataList.filter(el => el.doit == 2),
                    base = this.columnsBase
                
                base.forEach(el => el.flag = false)
                
                if(list.length == this.dataList.length) base[1].flag = true
                if(list1.length == this.dataList.length) base[2].flag = true
                if(list2.length == this.dataList.length) base[3].flag = true

                return base
            }
        },

        watch: {
            design: {
                handler(val) {
                    if(val) this.designIsChange = true
                },
                deep: true,
                immediate: true
            }
        },

        created(){},

        methods: {

            // 自定义列头
            renderHeader(h, {column, index}) {
                let self = this
                return h('Radio', {
                    props: {
                        label: index == 1 ? '可编辑' : index == 2 ? '只读' : '隐藏',
                        value: column.flag
                    },
                    on: {
                        'on-change': () =>{
                            self.columns.forEach((item,i) => {
                                item.flag = false
                                if(i == index) item.flag = true
                                self.dataList.forEach(el => {
                                    if(el.disabled.some(item => item == column.index)) {
                                        // 异步延迟执行赋值，确保值设置有效
                                        // 不会被Radio组件里面watch监听的的值覆盖
                                        setTimeout(() => {
                                            item.flag = false
                                        }, 10)
                                    }
                                })
                            })

                            self.dataList.forEach(item => {
                                item.doit = column.index
                            })

                            // 把数据传出去
                            self.$emit('tableSet', self.dataList)
                        }
                    }
                })
            },

            // 自定义表格
            render(h, params) {
                let self = this
                return h('Radio', {
                    props: {
                        value: self.isTrue(params), //判断单选框状态
                        disabled: params.row.disabled.some(item => item == params.column.index) ? true : false // 禁用单选框
                    },
                    on: {
                        'on-change': () => {
                            let tempArr = []
                            if(!self.isTrue(params))
                                self.dataList[params.index].doit = params.column.index
                            
                            self.dataList.forEach(item => {
                                if(item.doit == params.column.index) tempArr.push(item)
                            })

                            if(tempArr.length == self.dataList.length) {
                                self.columns.forEach(item => {
                                    item.flag = false
                                    if(item.index == params.column.index) item.flag = true
                                })
                            } else {
                                self.columns.forEach(item => {
                                    item.flag = false
                                })
                            }

                            // 把数据传出去
                            self.$emit('tableSet', self.dataList)
                        }
                    }
                })
            },

            // 初始化数据
            initData(val) {
                let list = [],
                    dataList = null
                val.forEach(el => {
                    let temp = {
                        name: el.title,
                        id: el.id,
                        necessary: el.type == 'DateRange' ? el.necessary && el.automatic : el.necessary,
                        disabled: el.required ? [1, 2] : [],
                        doit: 0
                    }

                    if(el.type == 'Caption') {
                        temp.disabled = [0]
                        temp.doit = 1
                    }

                    list.push(temp)
                    if(el.type == "Details") {
                        el.list.forEach(element => {
                            let temp = {
                                name: element.title,
                                necessary: element.type == 'DateRange' ? element.necessary && element.automatic : element.necessary,
                                disabled: [],
                                parentId: el.id,
                                id: element.id,
                                doit: 0
                            }

                            if(element.type == 'Caption') {
                                temp.disabled = [0]
                                temp.doit = 1
                            }
                            
                            list.push(temp)
                        })     
                    }
                })
                if(this.tableListSet.length == 0)  dataList = list
                else dataList = [...this.tableListSet, ...list].reduce((all,next) => all.some(item => item.id== next.id) ? all : [...all,next],[])

                // 数据外传 赋值
                this.$emit('tableSet', dataList)
                
                return dataList
            },

            // 是否显示选中
            isTrue(params) {
                if(params.row.disabled.length == 0) {
                    return params.row.doit == params.column.index ? true : false
                } else {
                    return params.row.doit == params.column.index && params.row.disabled.every(el => el != params.column.index) ? true : false
                }
            }
        },

        mounted(){}
    }
</script>

<style lang='less'>
    .workflow-table{
        &.ivu-table-wrapper-with-border {
            border: none;
        }
        .ivu-table{
            &::before, &::after {
                background-color: transparent;
            }
        }
        .ivu-table-cell{
            padding-left: 22px;
            padding-right: 22px;
        }
        .ivu-table-border td, .ivu-table-border th {
            border-right: none;
        }
        .ivu-radio-focus{
            box-shadow: none;
        }
        .workflow-table-name{
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .icons{
                position: absolute;
                left: -7px;
                top: 52%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                color: red;
            }
        }
    }
    
</style>
