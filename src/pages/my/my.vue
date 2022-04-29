<template>
  <view class="bg-gray-100 h-[100vh]">
    <view class="flex items-center px-3 py-4 bg-white">
      <view>
        <image v-if="!isLoggedIn || !user.avatar" class="w-10 h-10 rounded-full"
          src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" />
        <image v-else class="w-10 h-10 rounded-full" :src="user.avatar" />
      </view>
      <view class="ml-3 text-base font-medium text-black" @click="goLoginHandle">
        <text class="" v-if="!isLoggedIn">登录/注册</text>
        <text v-else>{{ user.name ? user.name : '未知昵称' }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import useHttpRepositories from '@/composables/useHttpRepositories';
import { storeToRefs } from "pinia";
import { onShow, onHide, onLoad, onUnload, onShareAppMessage } from '@dcloudio/uni-app'
const userStore = useUserStore();
const { user, isLoggedIn } = storeToRefs(userStore);
const { $http } = useHttpRepositories()
onShow(() => {
  console.log('page show')
})
function goLoginHandle(e: any) {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  } else {
    uni.getUserProfile({
      desc: '获取您的头像和昵称',
      lang: 'zh_CN',
      success: (res) => {
        console.log(res);
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
        $http.post({
          url: 'api/user/updateUserInfo',
          data: {
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          },
          success: (res) => {
            userStore.setUser(res);
          },
          complete: () => {
            uni.hideLoading();
          }
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>