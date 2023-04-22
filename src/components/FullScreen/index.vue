<template>
  <svg-icon
    icon-class="fullscreen"
    class="icon"
    @click="handelclick"
  ></svg-icon>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async handelclick () {
      if (document.fullscreenElement) { // 判断是否全屏
        await document.exitFullscreen() // 退出全屏
      } else {
        await document.documentElement.requestFullscreen() // 进入全屏
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.icon {
  color: #fff;
  font-size: 20px;
  margin-right: 20px;
}
</style>
