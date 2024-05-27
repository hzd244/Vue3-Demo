<template>
  <div class="handle-modal-no"></div>
  <!-- 新人引导弹窗 -->
  <a-modal
    v-model:open="showDialog1"
    title="新人引导弹窗(弹窗1)"
    @ok="showDialog1 = false"
  >
  </a-modal>
  <!-- 升级弹窗 -->
  <a-modal
    v-model:open="showDialog2"
    title="升级弹窗(弹窗2)"
    @ok="showDialog2 = false"
  >
  </a-modal>
  <!-- 权益弹窗 -->
  <a-modal
    v-model:open="showDialog3"
    title="权益弹窗(弹窗3)"
    @ok="showDialog3 = false"
  >
  </a-modal>
</template>

<script setup lang="ts">
import defaultTaskContainer from '@/hooks/use-priority-ref';

const showDialog1 = defaultTaskContainer.taskRef({
  val: false,
  no: 1,
});
const showDialog2 = defaultTaskContainer.taskRef({
  val: false,
  no: 2,
});

const showDialog3 = defaultTaskContainer.taskRef({
  val: false,
  no: 3,
});

// 用setTimeout模拟请求
setTimeout(() => {
  showDialog1.value = true;
}, 100);
setTimeout(() => {
  showDialog2.value = true;
}, 100);
setTimeout(() => {
  showDialog3.value = true;
}, 100);
</script>

<style lang="less" scoped>
.handle-modal-no {
  width: 100%;
  height: 100vh;
  text-align: center;
  margin: 0 auto;
  font-size: 30px;
  background: url('@/assets/background.jpg') no-repeat;
}
</style>
