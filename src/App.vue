<template>
  <div class="app">
    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style>
@import url(~@/style/base.css);
.app {
  height: 100%;
}
.spinner {
  display: none !important;
}
</style>
