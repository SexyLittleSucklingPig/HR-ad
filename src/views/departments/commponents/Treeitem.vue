<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="oncommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="isdialog"
      width="50%"
      @click.native.stop
      @close="handleAddclose"
    >
      <el-form
        ref="addFromRef"
        label-width="100px"
        :model="addDepartmentFrom"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentFrom.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentFrom.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input
            v-model="addDepartmentFrom.manager"
            placeholder="1-50个字符"
          ></el-input> -->
          <el-select
            v-model="addDepartmentFrom.manager"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentFrom.introduce"
            type="textarea"
            placeholder="1-300个字符"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdialog = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span></el-dialog
    >
  </div>
</template>

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartment, addDepartment, getDepartmentslist, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      const res = await getDepartmentslist()
      if (this.isEdit) {
        // 标题没有编辑
        const pid = this.node.data.pid // 父级id
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()// 通过父级id找兄弟元素
      } else {
        const id = this.node.data ? this.node.data.id : '' // 因为大标题没有data 但又要添加或编辑
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      isdialog: false,
      addDepartmentFrom: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '', // 部门介绍
        pid: ''
      },
      rules: {
        name: [
          { required: true, message: '部门不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '3到10字符之间', trigger: 'blur' },
          // change 只有值变了才会发送请求
          { validator: validateName, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false // 是否是编辑
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async oncommand (key) {
      if (key === 'a') {
        console.log('添加')
        this.isEdit = false
        this.isdialog = true
        this.getSimpleUserList()
      } else if (key === 'b') {
        console.log('编辑')
        this.isEdit = true // 编辑
        this.isdialog = true
        this.addDepartmentFrom = { ...this.node.data } // 点击编辑把数据赋值给添加表 复用框
      } else {
        try {
          await this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确定')
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
          this.$notify({
            message: '删除成功',
            duration: 1000
          })
        } catch (error) {
          console.log(error)
          this.$notify({
            message: '取消删除',
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    handleAddclose () {
      this.$refs.addFromRef.resetFields()
    },
    async onsubmit () {
      if (this.isEdit) {
        delete this.addDepartmentFrom.children
        await editDepartment(this.addDepartmentFrom)
      } else {
        // 判断在哪一新增 标题没有data.id 其他在node.data.id
        this.addDepartmentFrom.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentFrom)
      }
      this.isdialog = false
      this.$emit('delDepartment') // 子向父传值
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
