<template>
  <view>
    我的
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { onShow, onHide, onLoad, onUnload, onShareAppMessage } from '@dcloudio/uni-app'
const { isLogined } = useUserStore()
onShow(() => {
  console.log('page show')
  if (!isLogined()) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }
})
</script>

<style lang="scss" scoped>
</style>