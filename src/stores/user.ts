import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { UserInterface } from "@/typings/user";

export const useUserStore = defineStore("user", () => {
  const token = ref("");
  const user = ref({} as UserInterface);

  watch(token, (newValue, oldValue) => {
    console.log("token changed", newValue, oldValue);
    if (newValue !== oldValue) {
      // 持久化存储token
      uni.setStorage({
        key: "authorization_token_key",
        data: newValue,
        success: function () {
          console.log("success");
        },
      });
    }
  });

  watch(user, (newValue, oldValue) => {
    console.log("user changed", newValue, oldValue);
    // 持久化存储user
    uni.setStorage({
      key: "user_key",
      data: newValue,
      success: function () {
        console.log("success");
      },
    });
  });

  function setToken(t: string) {
    token.value = t;
  }

  function setUser(u: UserInterface) {
    user.value = u;
  }

  function isLogined() {
    return !!(token.value && user.value.mobile);
  }

  function initData() {
    uni.getStorage({
      key: "authorization_token_key",
      success: function (res) {
        setToken(res.data);
      },
    });
    uni.getStorage({
      key: "user_key",
      success: function (res) {
        setUser(res.data);
      },
    });
  }

  return {
    token,
    user,
    setToken,
    setUser,
    initData,
    isLogined,
  };
});
