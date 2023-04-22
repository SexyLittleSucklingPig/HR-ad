<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isloading" style="min-height: 700px">
        <el-tabs>
          <el-tab-pane label="用户管理"></el-tab-pane>
        </el-tabs>
        <!-- 用了一个行列布局 -->
        <Treeitem
          :node="titleObj"
          @delDepartment="getDepartmentslist"
        ></Treeitem>
        <el-tree :data="data" default-expand-all>
          <template v-slot="scope">
            <Treeitem
              :node="scope.node"
              @delDepartment="getDepartmentslist"
            ></Treeitem>
          </template>
        </el-tree>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentslist } from '@/api/departments'
import Treeitem from './commponents/Treeitem.vue'
export default {
  filters: {},
  components: {
    Treeitem
  },
  data () {
    return {
      data: [{
        label: '火箭研发部',
        children: [{
          label: '燃料'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      titleObj: {},
      isloading: true

    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentslist()
  },
  methods: {
    async getDepartmentslist () {
      const res = await getDepartmentslist()
      // console.log(res)
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      const res2 = tranferListToTree(res.depts, '')
      // console.log(res2)
      this.data = res2
      this.titleObj = res.depts[0]
      this.isloading = false
    }

  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
