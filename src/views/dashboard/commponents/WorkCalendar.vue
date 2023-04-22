<template>
  <div>
    <el-row type="flex" justify="end" :gutter="10">
      <el-col :span="6">
        <el-select
          v-model="year"
          size="mini"
          style="width: 100%"
          @change="handerChange"
        >
          <el-option
            v-for="(item, index) in 11"
            :key="index"
            :value="year - 6 + item"
            >{{ year - 6 + item }}</el-option
          >
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="month"
          size="mini"
          style="width: 100%"
          @change="handerChange"
        >
          <el-option v-for="(item, index) in 12" :key="index" :value="item">{{
            item
          }}</el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-calendar ref="calendar" v-model="value">
      <template #dateCell="scope">
        <span>{{ scope.date.getDate() }}</span>
        <div
          v-if="scope.date.getDay() === 6 || scope.date.getDay() === 0"
          class="rest"
        >
          休
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {
      month: (new Date()).getMonth() + 1,
      year: (new Date()).getFullYear(),
      value: new Date()
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    var that = this
    this.$refs.calendar.$el.addEventListener('click', function () {
      that.month = new Date(that.$refs.calendar.realSelectedDay).getMonth() + 1
    })
  },
  methods: {
    handerChange () {
      var str = this.year + '-' + this.month
      this.value = new Date(str)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-calendar__header {
  display: none;
}
::v-deep .el-calendar__body {
  padding: 0;
}
::v-deep .el-calendar-table td {
  border: none;
}
::v-deep .el-calendar-table tr td:first-child {
  border: none;
}
::v-deep .el-calendar-table tr:first-child td {
  border: none;
}
::v-deep .el-calendar-table .el-calendar-day {
  text-align: center;
}
.rest {
  background-color: orange;
  font-size: 12px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  color: #fff;
  text-align: center;
  line-height: 18px;
  display: inline-block;
  margin-left: 10px;
}
</style>

