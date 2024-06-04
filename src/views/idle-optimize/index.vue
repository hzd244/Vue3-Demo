<template>
  <div class="idle-optimize">
    <div class="top">
      <div class="text">模拟长任务导致页面卡顿</div>
      <div class="btn">
        <a-button style="margin-right: 20px" @click="executeLongTask" type="primary">
          常规模式
        </a-button>
        <a-button @click="idleFun" danger>优化模式</a-button>
      </div>
    </div>
    <div ref="ballEle" class="ball"></div>
    <div class="input">
      <span>输入内容：</span>
      <a-input v-model:value="value" style="width: 400px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';

const value = ref('');
const ballEle = ref<HTMLElement | null>(null);
const taskList = new Array(20000).fill(0);

const onTask = () => {
  const now = performance.now();
  while (performance.now() - now < 0.1) {} // 模拟耗时操作
};

const idleFun = () => {
  let i = 0;
  let idleOption = { timeout: 2000 }; // 任务超时时间

  function handler(idleDeadline: any) {
    while ((idleDeadline.timeRemaining() || idleDeadline.didTimeout) && i < taskList.length) {
      // 当前帧有剩余时间
      onTask();
      i++;
    }
    if (i < taskList.length) {
      window.requestIdleCallback(handler, idleOption);
    } else {
      message.success('长任务执行完成————优化后');
    }
  }
  window.requestIdleCallback(handler, idleOption);
};

const executeLongTask = () => {
  for (let i = 0; i < taskList.length; i++) {
    onTask();
  }
  message.success('长任务执行完成————优化前');
};

const ballAnimation = () => {
  let left = 0;
  let direction = 1;
  setInterval(() => {
    if (left >= 400 || left < 0) {
      direction *= -1;
    }
    left += direction;
    ballEle.value && (ballEle.value.style.transform = `translateX(${left}px)`);
  }, 16.7);
};

onMounted(() => {
  ballAnimation();
});
</script>

<style lang="less" scoped>
.idle-optimize {
  width: 500px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 50px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  .input {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ball {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: pink;
    margin-bottom: 20px;
  }
}
</style>
