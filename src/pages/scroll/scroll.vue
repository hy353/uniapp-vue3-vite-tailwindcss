<template>
  <view>
    <z-paging ref="paging" v-model="dataList" @query="queryList">
      <!-- {{ counter.count }} -->
      <view class="item" v-for="(item, index) in dataList" :key="index">
        <view class="item-title">{{ item.title }}</view>
      </view>
    </z-paging>
  </view>
</template>

<script setup lang="ts">
import { ref, inject, toRef, unref, Ref } from 'vue';
import { onShow, onHide, onLoad, onUnload, onShareAppMessage } from '@dcloudio/uni-app'
import { RequestInterface } from '@/typings/request';
// import { useCounterStore } from '@/stores/user';
const $http: RequestInterface = inject("$http") as RequestInterface;
const paging: any = ref(null)
const id = ref(0)
let dataList:Ref<Array<any>> = ref([])
// const counter = useCounterStore()
onLoad((options:any) => {
  console.log('page query', options)
  if (options.id) {
    id.value = parseInt(options.id)
  }
})
onShow(() => {
  console.log('page show')
})
onHide(() => {
  console.log('page hide')
})
onUnload(() => {
  console.log('page unload')
})
onShareAppMessage(() => {
  return {
    title: 'uni-app 小程序框架222',
    path: '/pages/tabBar/component/component'
  }
})
const queryList = (pageNo: any, pageSize: any) => {
  console.log(unref(id));
  const promises = [
    $http.get({
      url: '/api/user',
    }),
    $http.get({
      url: '/use2r',
      toastError: false
    })
  ];
  uni.showLoading({
    title: '加载中...',
    mask: true
  })
  Promise.allSettled(promises).then(res => {
    console.log(res);
    res.forEach(element => {
      if (element.status === 'fulfilled') {
        console.log(element.value)
      } else if (element.status === 'rejected') {
        console.log(element.reason)
      }
    });
  }).finally(() => {
    uni.hideLoading();
  })
  // ($http.get({
  //   url: '/user',
  //   loadingTip: '加载中...',
  //   loadingDuration: 2000
  // }) as Promise<any>).then(res => {
  //   console.log('success');
  //   console.log(res);
  // }).catch(err => {
  //   console.log('error');
  //   console.log(err);
  // })
  setTimeout(() => {
    let array = [];
    for (let index = 0; index < 100; index++) {
      array.push({
        title: `这是第${index}条数据`
      });
    }
    paging.value!.complete(array);
  }, 3000);
}
</script>

<style>
</style>
