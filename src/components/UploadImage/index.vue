<template>
  <div class="user-info" >

    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/*"
      :limit="limit"
      :class="{ hidden: filesList.length === limit }"
      :on-change="handleChange"
      :file-list="filesList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress :percentage="percentage"></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKID62h6F8k48uPhjUyA5k8FySfbGemdCUVF',
  SecretKey: 'UhdHekbASTDhtoSqxnMfhSw96mBJBn8C'
})
console.log(cos)
export default {
  filters: {},
  components: {},
  props: {
    limit: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: [],
      percentage: 0
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    handleRemove (file) {
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleChange (file, filesList) { // filesList 上传图片的数组
      this.filesList = filesList
    },
    handleRequest (obj) {
      var that = this
      cos.putObject({
        Bucket: 'wonendie-1313062372', /* 桶名 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + '-' + obj.file.name, /* 必须 随便写 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        // 图片较大 加载效果
        onProgress: function (progressData) {
          that.percentage = Math.floor(progressData.loaded / progressData.total * 100)
        }
      }, function (err, data) {
        console.log(err || data)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定  动态类名 交级
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
