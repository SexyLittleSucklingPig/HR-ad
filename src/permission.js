import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store' // 引入store 使用token
const writeList = ['/login', '/404'] // 白名单
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度效 果
  console.log('2')
  // 权限控制
  const token = store.state.user.token
  if (token) { // 有无token
    if (to.path === '/login') { // 有还想去登录· 不跳转路由
      NProgress.done() // 结束进度效果
      next('/')
    } else { // 有 去其他页面 放行
      if (!store.state.user.UserInfo.id) {
        // 手里有token 并访问的不是登录页面 发请求 请求个人资料
        const userInfo = await store.dispatch('user/getInfo')
        console.log(userInfo.roles.menus)
        const newRoutes = await store.dispatch('permission/filter', userInfo.roles.menus)
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        // console.log(to.path)
        next(to.path)
      }
      next()
    }
  } else { // 没有token
    if (writeList.includes(to.path)) { // 没有想去login等 放行
      next()
    } else { // 想去其他页面 强制跳转登录login
      next('/login')
      console.log('1q')
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束进度效果
})
