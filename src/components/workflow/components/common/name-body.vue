<template>
    <div class='name-body'>
        <ul class="name-body-list">
            <li class="name-body-list-item" v-for="(item, index) in list" :key="index">
                {{item.title || item.name}}
                <Icon type="md-remove" class="remove-icon" @click="remove(item, index)" />
            </li>
        </ul>
        <div class="clear" @click="clearAll">清空</div>
    </div>
</template>

<script>
    export default {
        name: 'namebody',
        components: {},
        data(){
            return {}
        },

        props: ['list'],

        created(){},

        methods: {
            // 移除当前选项
            remove(data, index) {
                this.$emit('remove', {data, index})
            },

            // 清空所有选择
            clearAll() {
                this.$emit('clear')
            }
        },

        mounted(){}
    }
</script>

<style lang='less' scoped>
    .name-body{
        position: relative;
        width: 100%;
        min-height: 120px;
        border: 1px solid rgba(204,204,204,1);
        border-radius:4px;
        overflow: hidden;
        margin: 10px 0;
        .name-body-list{
            display: flex;
            flex-wrap: wrap;
            padding: 15px 15px 30px;
            .name-body-list-item{
                position: relative;
                padding: 5px 15px;
                background: #5497D6;
                color: #fff;
                border-radius: 4px;
                margin-right: 15px;
                margin-bottom: 15px;
                .remove-icon{
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 12px;
                    height: 12px;
                    font-size: 12px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #E74D3C;
                    cursor: pointer;
                }
            }
        }
        .clear{
            position: absolute;
            right: 0;
            bottom: 0;
            padding: 5px 10px;
            cursor: pointer;
            color: #5497D6;
        }
    }
</style>
