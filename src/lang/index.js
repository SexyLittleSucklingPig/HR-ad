import Vue from 'vue'
import zh from './zh'
import en from './en'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// 国际化
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const messages = {
  en: {
    message: {
      hello: 'hello world'
    },
    ...en,
    ...enLocale
  },
  zh: {
    message: {
      hello: '陈桑,故乡的火山要喷发了'
    },
    ...zh,
    ...zhLocale
  }
}
import Cookies from 'js-cookie'
// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: Cookies.get('locale') || 'zh', // 设置地区
  messages // 设置地区信息
})
export default i18n
