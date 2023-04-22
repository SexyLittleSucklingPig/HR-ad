import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  routes: []
}
const mutations = {
  setroutes (state, payload) {
    state.routes = payload
  }
}
const actions = {
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    context.commit('setroutes', [...constantRoutes, ...newRoutes])
    return newRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
