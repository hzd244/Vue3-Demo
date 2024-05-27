<template>
  <div class="anchor-directory">
    <!-- 导航区 -->
    <nav class="nav">导航区</nav>
    <!-- 锚点目录 -->
    <div class="directory">
      <Anchor ref="AnchorRef" :offset="100" :anchor-list="anchorList" />
    </div>
    <!-- 内容区 -->
    <section class="main">
      <!-- 文章 -->
      <section class="content">
        <div class="item">
          <p id="blog-1">Why an Engagelab platfs</p>
        </div>
        <div class="item">
          <p id="blog-1-1">Why an Engagelab platform helps</p>
        </div>
        <div class="item">
          <p id="blog-2">Why social media is important to any business</p>
        </div>
        <div class="item">
          <p id="blog-2-1">1.Why an Engagelab platform</p>
        </div>
        <div class="item">
          <p id="blog-2-2">2.How Does Automatic ognition Work?</p>
        </div>
        <div class="item">
          <p id="blog-3">Why an Engagelab platform helps</p>
        </div>
        <div class="item">
          <p id="blog-3-1">1.Why an Engagelab platform</p>
        </div>
        <div class="item">
          <p id="blog-3-2">2.How Does Automatic Speech Recoon Work?</p>
        </div>
      </section>
      <!-- 底部推荐模块 -->
      <section class="recommend">recommend</section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import Anchor from '@/components/anchor/anchor.vue';
import { reactive } from 'vue';
import type { AnchorList } from '@/components/anchor/constants';

const anchorList = reactive<Array<AnchorList>>([
  {
    href: '#blog-1',
    title: 'Why an Engagelab platfs',
    children: [
      {
        href: '#blog-1-1',
        title: 'Why an Engagelab platform helps',
      },
    ],
  },
  {
    href: '#blog-2',
    title: 'Why social media is important to any business',
    children: [
      {
        href: '#blog-2-1',
        title: '1.Why an Engagelab platform ',
      },
      {
        href: '#blog-2-2',
        title: '2.How Does Automatic ognition Work?',
      },
    ],
  },
  {
    href: '#blog-3',
    title: 'Why an Engagelab platform helps',
    children: [
      {
        href: '#blog-3-1',
        title: '1.Why an Engagelab platform ',
      },
      {
        href: '#blog-3-2',
        title: '2.How Does Automatic Speech Recoon Work?',
      },
    ],
  },
]);
const AnchorRef = ref<InstanceType<typeof Anchor> | null>(null);

// 当底部推荐模块出现时 隐藏锚点目录
const observerFn = () => {
  const element = document.getElementsByClassName(
    'recommend',
  )[0] as HTMLElement;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        AnchorRef.value?.updateShow(false);
      } else {
        AnchorRef.value?.updateShow(true);
      }
    });
  });
  element && observer.observe(element);
};

onMounted(() => {
  nextTick(() => {
    observerFn();
  });
});
</script>

<style lang="less" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 76px;
  background-color: #202d31;
  text-align: center;
  color: #ffffff;
  line-height: 76px;
}
.directory {
  position: fixed;
  top: 100px;
  left: 50px;
  width: 300px;
}
.main {
  width: calc(100% - 400px);
  margin-left: 400px;
  margin-top: 100px;
  .item {
    width: 100%;
    height: 500px;
    background-color: pink;
    &:nth-child(2n) {
      background-color: green;
    }
  }
  .recommend {
    width: 100%;
    height: 500px;
    background-color: antiquewhite;
  }
}
</style>
