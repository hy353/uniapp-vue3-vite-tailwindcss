import request from "./request";
import { useUserStore } from "@/stores/user";

var baseUrl = "http://127.0.0.1:20002/";

request.setConfig({
  baseUrl: baseUrl,
  debug: true,
});

request.setRequestConfig({
  url: "",
  timeout: 90000,
});

// 请求拦截
request.interceptor.request = (config) => {
  const userStore = useUserStore();
  config.header["Accept"] = "application/json";

  // 给header添加全局请求参数token
  if (!config.header.token) {
    config.header.Authorization = "Bearer " + userStore.token;
  }
  // 添加一个自定义的参数，默认异常请求都弹出一个toast提示
  if (config.toastError === undefined) {
    config.toastError = true;
  }
  return config;
};

// 响应拦截
request.interceptor.response = (res, config) => {
  if (res.code === 200) {
    res.success = true;
  }
  return res;
};

// 全局的错误异常处理
request.interceptor.fail = (res, config) => {
  let ret = undefined;
  let msg = "";
  if (res.statusCode === 200) {
    // 业务错误
    msg = (res.data as AnyObject).message;
    ret = res.data;
  } else if (res.statusCode === 401) {
    // token失效，需要重新登录
    uni.navigateTo({
      url: "/pages/loign/login",
    });
  } else if (res.statusCode === 500) {
    // 其它错误
    msg = (res.data as AnyObject).error.message;
  } else if (res.statusCode > 0) {
    // HTTP错误
    msg = "服务器异常[" + res.statusCode + "]";
  } else {
    msg = res.errMsg;
  }
  console.log(msg);
  if (config.toastError && msg) {
    uni.showToast({
      title: msg,
      duration: 2000,
      icon: "none",
    });
  }
  return ret || msg;
};

export default request;
