<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1条记录">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExecl"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1">
            复杂表头execl导出</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
            >exel导出</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="addEmployeeVisible = true"
            >新增员工</el-button
          >
        </template>
      </PageTool>
      <el-card style="margin-top: 15px">
        <el-table border :data="employee">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                alt=""
                style="width: 40px"
                @click="qrshow(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column> -->
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px" align="center">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="$router.push('/employee/detail/' + scope.row.id)"
                >查看</el-button
              >
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRoleDialog(scope.row.id)"
                >角色</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="分配角色" :visible.sync="roleVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="assignRoles">确定</el-button>
        <el-button @click="roleVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      title="新增员工"
      :visible.sync="addEmployeeVisible"
      @close="handeClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <el-tree
            v-if="departmentlist.length > 0"
            :data="departmentlist"
            default-expand-all
            :props="{ label: 'name' }"
            @node-click="handeNodeClick"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary">确定</el-button>
        <el-button @click="addEmployeeVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog title="图片二维码" :visible.sync="showQr">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { getDepartmentslist } from '@/api/departments'
import { validmobile } from '@/utils/validate'
import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
import { getEmployee, assignRoles } from '@/api/employee'
import employees from '@/constant/constant/employees'// 模板
export default {
  components: {},
  filters: {
    formatFormType (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === id - 0).value
      } else {
        return '未知'
      }
    }
  },
  data () {
    const validateMobile = (rule, value, callback) => {
      validmobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 20
      },
      employee: [],
      total: null,
      roleVisible: false,
      checkList: ['选中且禁用', '复选框 A'], // 选中的数组
      roleList: [],
      id: null, // 全局 ID（被点击的那个id）
      addEmployeeVisible: false, // 新增显示隐藏
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      hireType: employees.hireType,
      departmentlist: [],
      showQr: false// 头像显示
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employee = res.rows
      this.total = res.total
    },
    formatterEmployee (row, column, cellValue, index) {
      // return employees.hireType.find(item => item.id === cellValue).value
      // const res = employees.hireType.find(item => item.id === cellValue)
      var obj = employees.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
      // return employees.hireType.find(item => item.id === cellValue).value
    },
    async exportExecl () {
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      console.log(data) // 把数据每一项的值放在空数组
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      // 点击按钮发送请求
      import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = ['1', '2']
        //   const data = [[1, '2'], [2, '3']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人资', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    async exportExcel1 () {
      const multiHeader = [['', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    async showRoleDialog (id) {
      this.id = id
      this.roleVisible = true
      const { rows } = await getRoleList({ page: 1, size: 9999 })
      console.log(rows)
      this.roleList = rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
    },
    async assignRoles () { // 发送勾选数据
      const res = await assignRoles({
        id: this.id, roleIds: this.checkList
      })
      console.log(res)
      this.roleVisible = false
    },
    handeClose () { // 关闭新增表格 清空
      this.$refs.employeeRef.resetFields()
      this.departmentlist = []
    },
    async showDepartment () { // 获取数据转为树状图
      const res = await getDepartmentslist()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
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
      this.departmentlist = tranferListToTree(res.depts, '')
    },
    handeNodeClick (obj) {
      this.employeeForm.departmentName = obj.name // 工作部门 点击填充到表格
      this.departmentlist = [] // 根据v-if length条件 关闭树状图
    },
    qrshow (src) {
      this.showQr = true
      // 数据改变 不能立即操作DOM
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success')
        })
      })
    }

  }
}
</script>

<style scoped lang='scss'>
</style>
