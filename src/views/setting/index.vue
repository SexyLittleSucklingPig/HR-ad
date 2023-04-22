<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户管理" name="first">
            <RoleMange></RoleMange>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <CompayInfo></CompayInfo>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import RoleMange from './components/RoleMange.vue'
import CompayInfo from './components/CompayInfo.vue'
export default {
  filters: {},
  components: {
    RoleMange,
    CompayInfo
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
