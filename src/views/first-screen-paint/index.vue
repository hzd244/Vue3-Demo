<template>
  <div class="first-screen-paint">
    <div class="module one">
      module one
      <img
        data-src="https://static.povison.com/filters:quality(80)/fit-in/2340x1404/media/search/tip/202406181526097631.jpg"
        src="https://static.povison.com/filters:quality(80)/fit-in/2340x1404/media/search/tip/202406181526097631.jpg"
        alt=""
      />
    </div>
    <div class="module two">module two</div>
    <div class="module three">module three</div>
  </div>
</template>

<script setup lang="ts">
import '@/plugins/first-screen-paint/index.js';

// 获取LCP
function getLCP() {
  const entryHandler = (list: any) => {
    for (const entry of list.getEntries()) {
      observer.disconnect();
      console.log('LCP: ', (entry.startTime / 1000).toFixed(4) + 's');
    }
  };
  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
}

// 获取首屏渲染时间
function getFSPTime() {
  if (window.$fsp) {
    $fsp.getFirstScreenTime(3000).then(data => {
      console.log('FSP: ', (data.duration / 1000).toFixed(4) + 's');
      console.log(data);
    });
  }
}

getLCP();
getFSPTime();
</script>

<style lang="less" scoped>
.module {
  width: 100%;
  min-height: 370px;
  text-align: center;
}
.one {
  background-color: green;
}
.two {
  background-color: powderblue;
}
.three {
  background: url('https://static.povison.com/filters:quality(80)/fit-in/1200x600/media/homepage/image/202406131605325181.jpg');
  background-size: contain;
}
img {
  max-width: 100%;
}
</style>
