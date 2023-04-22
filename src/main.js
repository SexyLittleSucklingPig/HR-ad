import Vue from 'vue'
// 不同浏览器标签渲染效果相同
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon svg图标
import '@/permission' // permission control权限
import component from './components'
Vue.use(component)
// 过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
import i18n from './lang'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false
// 自定义指令引入// 批量引入自定义指令 简化写法
import * as obj from '@/directives' // 得到对象
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})
import mixins from './mixmins'
Vue.mixin(mixins)
// 打印插件
import Print from 'vue-print-nb'
// Global instruction
Vue.use(Print)
// 国际化
new Vue({
  i18n,
  el: '#app',
  router,
  store,
  render: h => h(App)
})
