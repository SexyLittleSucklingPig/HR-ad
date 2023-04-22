<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <el-form
            ref="userInfoRef"
            style="width: 400px; margin-left: 200px; margin-top: 50px"
            :model="userInfo"
            :rules="userInfoRules"
            label-width="80px"
          >
            <el-form-item prop="username" label="用户名">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button type="info">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人信息" name="second">
          <UserInfo :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user' //
import { saveEmployee } from '@/api/employee' // 修改请求
import UserInfo from './commponents/UserInfo.vue'
import JobInfo from './commponents/JobInfo.vue'
export default {
  filters: {},
  components: {
    UserInfo,
    JobInfo
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      console.log(res)
      this.password = null
      this.userInfo = res
    },
    save () {
      console.log(1)
      this.$refs.userInfoRef.validate(async valid => {
        if (!valid) return this.$message.error('表单数据校验失败')
        const res = await saveEmployee(this.id, this.userInfo)
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
