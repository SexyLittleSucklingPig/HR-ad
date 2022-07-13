import axios from 'axios'
// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量 url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
export default request
