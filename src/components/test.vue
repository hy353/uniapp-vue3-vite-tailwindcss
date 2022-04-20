<template>
  <view v-if="list.length > 0">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="bg-red-300 w-screen m-1 text-center p-1"
    >
      <view class="flex flex-col">
        <view>
          {{ item }}
        </view>
        <view>
          <slot :item="item" :index="index" :twice="twiceTheCounter"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, computed } from "vue";
export default {
  components: {},
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  setup(props: any) {
    console.log(props);
    const counter = ref(20);
    const twiceTheCounter = computed(() => counter.value * 2);
    return { twiceTheCounter };
  },
};
</script>

<style lang="scss" scoped></style>
