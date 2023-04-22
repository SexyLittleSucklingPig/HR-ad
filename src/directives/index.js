
// 自定义指令 定义用户头像
// Vue.directive('imgerror', {
// inserted 所在标签插入到DOM中执行
// inserted (el, binding) {
//   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
// },
// 数据更新时执行
//   update (el, binding) {
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })
export const imgerror = {
  inserted (el, binding) {
    el.onerror = function () {
      el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
