import Vue from 'vue'
import App from './App.vue'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

// 工作流
import Workflow from '@/components/workflow/index'

Vue.use(ViewUI)
Vue.use(Workflow)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
