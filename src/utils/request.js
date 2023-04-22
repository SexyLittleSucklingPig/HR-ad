import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth' // 获取token时间戳
import router from '@/router'
// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量 url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    // 获取当前时间减去时间戳 大于两小时 清空token和用户数据 跳转登录页面
    const time = Date.now() - getTime()
    if (time > 7200000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 解构获取的数据（response）为数据 状态 提示消息
  const { data, success, message } = response.data
  if (success) { // 状态成功
    return data // 请求return结果为data
  } else {
    Message.error(message) // 在页面组件内可不写提示 而是在拦截器写
    return Promise.reject(new Error(message)) // 只有使用Promise.reject(new Error())才能被trycatch捕获错误
  }
}, function (error) {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  // 对响应错误
  return Promise.reject(error)
})
export default request
