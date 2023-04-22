<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisible = true;
        isEdit = false;
        form={}
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" stripe style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="角色名" sortable> </el-table-column>
      <el-table-column prop="description" label="描述" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="set(scope.row.id)">分配权限</el-button>
          <el-button type="text" @click="setRolelist(scope.row)"
            >修改</el-button
          >
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 3, 4, 5, 6]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog title="提示" :visible.sync="rightVisible" width="20%">
      <el-tree
        v-if="rightVisible"
        ref="mytree"
        :data="permissions"
        show-checkbox
        default-expand-all
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="selectedPermissions"
      >
      </el-tree>
      <template #footer>
        <el-button @click="rightVisible = false">取 消</el-button>
        <el-button type="primary" @click="seve">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      :title="isEdit ? '编辑' : '添加'"
      :visible.sync="roleDialogVisible"
      @close="reset"
    >
      <el-form ref="myform" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onClick">确认</el-button>
        <el-button @click="roleDialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 第几页
        pagesize: 4 // 每页数量
      },
      roleList: [], // 获取角色数据·
      total: null, // 总数据
      rightVisible: false, // 分配权限显示
      permissions: [], // 所有权限
      selectedPermissions: [], // 添加的权限ID数组
      id: '', // 点击的id
      roleDialogVisible: false, // 新增角色显示
      form: { // 添加角色输入框数据
        name: '',
        description: ''
      },
      rules: { // 校验
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      defaultProps: { // 树状渲染条件
        children: 'children',
        label: 'name'
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取表单数据
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      this.roleList = res.rows
      this.total = res.total
    },
    handleCurrentChange (page) { // 第几页
      this.paramsObj.page = page
      this.getRoleList()
    },
    handleSizeChange (size) { // 一页多少条数据
      this.paramsObj.pagesize = size
      this.getRoleList()
    },
    // 删除
    del (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.roleList.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配权限获取数据j
    async set (id) {
      // console.log(id)
      this.id = id
      // 获取所有权限
      const res = await getPermissions()
      // console.log(res)
      this.permissions = tranferListToTree(res, '0')
      // 根据ID获取带有的权限
      const res1 = await getPermissionsById(id)
      // console.log(res1) // 获取到一个对象 有一个数组为被选中id
      this.selectedPermissions = res1.permIds
      // console.log(this.selectedPermissions)
      this.rightVisible = true
    },
    // 分配权限确认点击
    async seve () {
      // console.log(this.$refs.mytree.getCheckedKeys())
      await assignPermission(this.id, this.$refs.mytree.getCheckedKeys())
      this.rightVisible = false
    },
    // 添加角色
    onClick () {
      this.$refs.myform.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    // 编辑角色
    setRolelist (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      // this.form = { ...row } // 浅拷贝
      this.form = Object.assign({}, row) // 浅拷贝
    },
    // 关闭表单格式化数据
    reset () {
      this.$refs.myform.resetFields()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
