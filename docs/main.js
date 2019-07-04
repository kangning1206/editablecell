import Vue from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue'

/**
 * css 区域
 */
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)

new Vue({
  el: '#app',
  render: (h) => h(App)
})
