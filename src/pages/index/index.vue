<template>
  <view class="flex flex-col items-center justify-center">
    <navigator
      url="/pages/login/login?id=123"
      open-type="navigate"
      hover-class="bg-sky-500">
      <image
        class="logo"
        :src="user.avatar ? user.avatar : '/static/logo.png'" />
    </navigator>
    <view class="flex justify-center">
      <text class="text-xl text-black title dark:text-red-300">
        {{ user.name ? user.name : title }}
      </text>
    </view>
    <view class="m-2 dark">
      <uni-badge size="small" :text="100" absolute="rightTop" type="primary">
        <button
          :disabled="false"
          :loading="false"
          hover-class="bg-sky-600"
          class="p-2 text-xs text-white bg-sky-500 dark:bg-black"
          data-id="1223"
          @click="componentClick">
          这是一个登录按钮
        </button>
      </uni-badge>
    </view>
    <uni-card
      title="基础卡片"
      sub-title="副标题"
      extra="额外信息"
      :isFull="true"
      thumbnail="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png">
      <text class="line-clamp-1">
        这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。
      </text>
      <text class="material-icons outlined">account_circle</text>
    </uni-card>
    <view v-if="show">1111</view>

    <u-modal :show="show" :title="title" content="11111"></u-modal>
    <test :list="[1, 2, 3, 4]">
      <template v-slot="{ item, index, twice }">
        <button @click="componentClick" :data-item="item" v-if="showArr[index]">
          按钮{{ twice }}{{ index }}
        </button>
      </template>
    </test>
  </view>
  <u-tabbar
    :value="value1"
    :fixed="false"
    :placeholder="false"
    :safeAreaInsetBottom="false">
    <u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
    <u-tabbar-item text="放映厅" icon="photo" @click="click1"></u-tabbar-item>
    <u-tabbar-item
      text="直播"
      icon="play-right"
      @click="click1"></u-tabbar-item>
    <u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
  </u-tabbar>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import test from '../../components/test.vue'
import useHttpRepositories from '@/composables/useHttpRepositories'
const title = ref('Hello123')
const showArr = ref([true, false, false, false])
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { $http } = useHttpRepositories()
const show = ref(false)
const value1 = ref(0)
const componentClick = (e: any) => {
  // user.value.name = '11';
  // title.value = '111';
  // show.value = true;
  showArr.value = [true, true, true, true]
  uni.$u.route({
    url: 'pages/scroll/scroll',
    params: {
      name: 'lisa'
    }
  })
}
const click1 = (e: any) => {
  console.log(e)
}
</script>

<style lang="scss" scoped>
.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}
</style>
