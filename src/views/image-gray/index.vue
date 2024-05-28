<template>
  <div class="image-gray">
    <input ref="inputEle" type="file" id="imageInput" />
    <div ref="previewEle" class="preview">
      <h2>预览</h2>
      <img v-if="imgSrc" :src="imgSrc" alt="Preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const previewEle = ref<HTMLElement | null>(null);
const inputEle = ref<HTMLElement | null>(null);
const imgSrc = ref('');

type EventType = EventTarget & { files: any };

const handleImageUpload = (event: Event) => {
  const file = (event.target as EventType).files[0];

  if (!file) return;
  // 使用FileReader来读取上传的图像文件
  const reader = new FileReader();

  // 二进制流读取完成
  reader.onload = function (e) {
    const imageData = e.target!.result;

    // 创建一个新的Web Worker
    const worker = new Worker('/worker/image-gray.js');

    // 使用 createImageBitmap 来转换数据
    createImageBitmap(new Blob([imageData!])).then(imageBitmap => {
      // 向Web Worker发送图像数据
      worker.postMessage({ imageBitmap }, [imageBitmap]);

      // 监听Web Worker的消息
      worker.onmessage = function (e) {
        const processedImageBitmap = e.data.processedImageBitmap;

        // 在预览元素中显示处理后的图像
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = processedImageBitmap.width;
        previewCanvas.height = processedImageBitmap.height;
        const previewCtx = previewCanvas.getContext('2d');
        previewCtx!.drawImage(processedImageBitmap, 0, 0);
        imgSrc.value = previewCanvas.toDataURL();
      };
    });
  };

  // 读取图像文件,readAsArrayBuffer将文件读取成二进制流
  reader.readAsArrayBuffer(file);
};

onMounted(() => {
  inputEle.value &&
    inputEle.value.addEventListener('change', handleImageUpload);
});
</script>

<style lang="less" scoped>
.image-gray {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  border: 1px solid rgb(205, 198, 198);
  padding: 20px;
  .preview {
    margin-top: 30px;
  }
}
</style>
