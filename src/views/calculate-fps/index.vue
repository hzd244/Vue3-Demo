<template>
  <div class="calculate-fps">
    <p>当前FPS: {{ currentFps }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentFps = ref(0);
let ticks = 0;
let last = Date.now();

//循环调用 requestAnimationFrame
const rafLoop = () => {
  ticks += 1;
  //每30帧统计一次帧率
  if (ticks >= 30) {
    const now = Date.now();
    const diff = now - last;
    const fps = Math.round(1000 / (diff / ticks));
    last = now;
    ticks = 0;
    console.log(fps);
  }
  requestAnimationFrame(rafLoop);
};

//开始执行
requestAnimationFrame(rafLoop);
</script>

<style lang="less" scoped></style>
