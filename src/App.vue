<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user"
onLaunch(() => {
  console.log("App Launch");
  const { initData } = useUserStore()
  initData()
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import 'tailwindcss/base';
@import 'tailwindcss/utilities';
@import '@/static/css/initialize.scss';
@import '@/static/css/index.scss';
</style>
