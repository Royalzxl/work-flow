<template>
    <div class='branch-box'>
        <Button class="add-branch" @click="addCondition">添加条件</Button>
        <!-- 分支插槽 -->
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return {}
        },

        props: ['node'],

        created(){},

        methods: {
            // 新增条件分支
            addCondition() {
                this.$emit('addCondition')
            }
        },

        mounted(){}
    }
</script>
