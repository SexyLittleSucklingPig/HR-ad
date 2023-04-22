import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  UserInfo: {}
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.UserInfo = payload
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state) {
    state.UserInfo = {}
  }
}
const actions = {
  async login (context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setToken(res)
    setTime(Date.now())
  },
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    console.log(res1)
    console.log(res)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res
  },
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setroutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

