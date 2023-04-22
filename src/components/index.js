import PageTool from './PageTool'
import UploadImage from './UploadImage'
import FullScreen from './FullScreen'
import TagsView from './TagsView'
export default { // Vue.use()会执行install 从而导入多个组件  插件固方法  导出全部组件 方便引入
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
    Vue.component('FullScreen', FullScreen)
    Vue.component('TagsView', TagsView)
  }
}
