const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.UserInfo.username,
  avatar: state => state.user.UserInfo.staffPhoto,
  compayId: state => state.user.UserInfo.companyId,
  routes: state => state.permission.routes
}
export default getters
