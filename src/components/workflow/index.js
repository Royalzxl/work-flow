// 全局批量注册组件

import index from './index.vue';
import node from './template/node/node.vue';

const components = {index, node};

const install = function (Vue, opts = {}) {
    Object.keys(components).forEach((key) => {
        Vue.component(components[key].name, components[key])
    });
}

export default install