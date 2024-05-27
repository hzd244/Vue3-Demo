<template>
  <div ref="ImgContainer" class="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as _ from 'lodash';

// 导入所有的图片
let imageObj = import.meta.glob('@/assets/img/*.*', { eager: true });
let imageList = Object.values(imageObj).map((v: any) => v.default);

const imgWidth = 200; // 每张图片的宽度
const spaceWidth = 30; // 水平间隙的宽度
const spaceHeight = 30; // 垂直间隙的高度
const ImgContainer = ref();

// 1. 加入图片元素
const createImgs = () => {
  for (let i = 0; i < imageList.length; i++) {
    let img = document.createElement('img');
    img.src = imageList[i];
    img.onload = setPositions;
    img.style.position = 'absolute';
    img.style.width = imgWidth + 'px';
    img.style.transition = '0.3s';
    ImgContainer.value.appendChild(img);
  }
};

// 设置每张图片的位置
const setPositions = () => {
  ImgContainer.value.style.width = '60%'; // 重置容器的宽度
  let info = cal(); // 得到列数和间隙空间
  let nextTops = new Array(info.columns); // 该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
  nextTops.fill(0); // 数组每一项填充为0
  for (let i = 0; i < ImgContainer.value.children.length; i++) {
    let img = ImgContainer.value.children[i];
    // 找到nextTops中的最小值作为当前图片的纵坐标
    let minTop = Math.min.apply(null, nextTops);
    img.style.top = minTop + 'px';
    // 重新设置数组这一项的下一个top值
    let index = nextTops.indexOf(minTop); // 得到使用的是第几列的top值
    nextTops[index] += img.height + spaceHeight;
    let left = index * info.sapce + index * imgWidth;
    img.style.left = left + 'px';
  }
  let max = Math.max.apply(null, nextTops); // 求最大值
  ImgContainer.value.style.height = max + 'px'; // 3. 设置容器的高度
};

// 计算一共有多少列，间隙的数量
const cal = () => {
  let containerWidth = ImgContainer.value.clientWidth; // 容器的宽度
  let columns = Math.floor(containerWidth / imgWidth); // 计算列数
  let spaceNumber = columns - 1; // 间隙数量
  ImgContainer.value.style.width =
    columns * imgWidth + spaceNumber * spaceWidth + 'px'; // 重置容器的宽度
  return {
    sapce: spaceWidth,
    columns,
  };
};

const headleResize = _.debounce(setPositions, 300);

onMounted(() => {
  createImgs();
  window.addEventListener('resize', headleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', headleResize);
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 60%;
  margin: 50px auto;
}
</style>
