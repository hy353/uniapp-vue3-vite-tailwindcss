<template>
  <view class="flex items-center flex-col justify-center">
    <navigator url="/pages/scroll/scroll?id=123" open-type="navigate" hover-class="bg-sky-500">
      <image class="logo" :src="avatarUrl ? avatarUrl : '/static/logo.png'" />
    </navigator>
    <view class="flex justify-center">
      <text class="title dark:text-red-300 text-xl text-black">
        {{ nickName ? nickName : title }}
      </text>
    </view>
    <view class="dark m-2">
      <uni-badge size="small" :text="100" absolute="rightTop" type="primary">
        <button :disabled="false" :loading="false" hover-class="bg-sky-600"
          class="bg-sky-500 text-white text-xs p-2 dark:bg-black" @click="loginHandle" data-id="1223">
          这是一个登录按钮
        </button>
      </uni-badge>
    </view>
    <uni-card title="基础卡片" sub-title="副标题" extra="额外信息" :isFull="true"
      thumbnail="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png">
      <text>
        这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。
      </text>
    </uni-card>
    <test :list="[1, 2, 3, 4]">
      <template v-slot="{ item, index, twice }">
        <button @click="componentClick" :data-item="item" v-if="showArr[index]">
          按钮{{ item }}{{ twice }}
        </button>
      </template>
    </test>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import test from "../../components/test.vue";
const title = ref("Hello123");
const avatarUrl = ref("");
const nickName = ref("");
const showArr = ref([true, false, false, true]);
const loginHandle = async (e: WechatMiniprogram.BaseEvent) => {
  console.log(e.currentTarget.dataset["id"])
  console.log(e);
  uni.getUserProfile({
    lang: "zh_CN",
    desc: "用户展示您的信息",
    success: (res: UniApp.GetUserProfileRes) => {
      console.log(res);
      avatarUrl.value = res.userInfo.avatarUrl;
      nickName.value = res.userInfo.nickName;
    },
    fail: (err: UniApp.GetUserProfileRes) => {
      console.log(err.errMsg);
    },
  });
};
const componentClick = (e: WechatMiniprogram.BaseEvent) => {
  console.log(e.currentTarget.dataset["item"]);
};
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
