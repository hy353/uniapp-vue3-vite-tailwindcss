<template>
  <view>
    <view class="mt-16">
      <view class="flex justify-center">
        <image src="@/static/logo.png" mode="scaleToFill" class="w-[200rpx] h-[200rpx]" />
      </view>
      <view class="m-10 mt-10">
        <button :disabled="false" :loading="false" :open-type="agreement ? 'getPhoneNumber' : 'error'"
          hover-class="hover-button-class" @getphonenumber="getPhoneNumberHandle" @click="loginHandle"
          class="text-white border-none h-[100%] from-cyan-300 to-cyan-500 bg-gradient-to-r">
          微信登录
        </button>
      </view>
      <view class="flex items-center justify-center text-xs text-cyan">
        <checkbox-group @change="checkboxChange">
          <checkbox class="scale-[0.65] round cyan" value="cb" :checked="agreement" />
        </checkbox-group>
        <text class="text-gray-400">已阅读并同意</text>
        <text class="ml-1 text-cyan-500">用户协议、隐私政策、买家须知</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useHttpRepositories from '@/composables/useHttpRepositories';
import { useUserStore } from '@/stores/user';

const { $http } = useHttpRepositories()
const userStore = useUserStore();
const agreement = ref(false);
const checkboxChange = (e: { detail: { value: string | string[]; }; }) => {
  agreement.value = e.detail.value.includes("cb");
}

const loginHandle = async (e: any) => {
  if (!agreement.value) {
    uni.showToast({
      title: "请阅读并勾选页面协议",
      icon: "none"
    });
  }
}

const getPhoneNumberHandle = async (e: any) => {
  if (e.detail.code) {
    uni.showLoading({
      title: "登录中..."
    });
    try {
      let phone = await $http.post({
        url: "api/wechat/weapp/getPhoneNumber",
        data: {
          code: e.detail.code
        },
        toastError: true
      });
      if (phone) {
        let loginRes: UniApp.LoginRes = await new Promise((resolve, reject) => {
          uni.login({
            provider: "weixin",
            success: (res) => {
              resolve(res);
            },
            fail: (err) => {
              reject(err);
            }
          })
        })

        let httpRes = await $http.post({
          url: 'api/wechat/weapp/login',
          data: {
            code: loginRes.code,
            mobile: phone.phoneNumber
          }
        })
        userStore.setToken(httpRes.token);

        let userRes = await $http.get({
          url: 'api/user'
        })
        userStore.setUser(userRes)

        uni.navigateBack({
          delta: 1,
          fail: (err) => {
            uni.reLaunch({
              url: "/pages/index/index"
            })
          }
        });
      }
    } catch (e) {
      uni.hideLoading();
    } finally {
      uni.hideLoading();
    }
  }
};
</script>

<style scoped lang="scss">
.hover-button-class {
  @apply from-cyan-500 to-cyan-500;
}
</style>