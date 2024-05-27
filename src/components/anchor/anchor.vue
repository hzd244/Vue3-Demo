<template>
  <section ref="anchorRef" class="anchor">
    <section v-show="showAnchor" class="anchor__body">
      <p class="anchor__title">Page Table of Contents</p>
      <div class="anchor__list">
        <!-- 一级 -->
        <div
          v-for="(item, index) in anchorList"
          :key="index"
          class="anchor__item"
        >
          <AnchorLink
            :href="item.href"
            :title="item.title"
            :show-arrow="true"
          />
          <!-- 二级 -->
          <div
            v-show="hrefShow[item.href]"
            class="anchor__list anchor__list__sub"
          >
            <div
              v-for="(child, ind) in item.children"
              :key="ind"
              class="anchor__item"
            >
              <AnchorLink
                :href="child.href"
                :title="child.title"
                :show-arrow="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <div @click="showAnchor = !showAnchor" :class="collapseCls">
      <img :src="arrowIcon" alt="" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch, onBeforeUnmount, computed } from 'vue';
import {
  animateScrollTo,
  getElement,
  getOffsetTopDistance,
  getScrollElement,
  throttleByRaf,
  generateHrefMap,
  generateHrefShow,
  findParentHref,
} from './anchor.helper';
import { anchorKey } from './constants';
import type {
  AnchorLinkState,
  AnchorList,
  HrefMap,
  HrefShow,
} from './constants';
import AnchorLink from '@/components/anchor/anchor-link.vue';
import ArrowLeftPng from '@/assets/anchor/anchor-arrow-left.png';
import ArrowRightPng from '@/assets/anchor/anchor-arrow-right.png';

const props = defineProps({
  /**
   * @description 设置锚点滚动的偏移量
   */
  offset: {
    type: Number,
    default: 0,
  },
  /**
   * @description 设置容器滚动持续时间，单位为毫秒
   */
  duration: {
    type: Number,
    default: 300,
  },
  /**
   * @description 数据源
   */
  anchorList: {
    type: Array<AnchorList>,
    default: () => [],
  },
});
const emit = defineEmits<{
  (e: 'change', href: string): void;
  (e: 'click', event: MouseEvent, href: string): void;
}>();

const hrefMap = ref<HrefMap>({});
const hrefShow = ref<HrefShow>({});

const currentAnchor = ref('');
const anchorRef = ref<HTMLElement | null>(null);
const containerEl = ref<HTMLElement | Window>();
const showAnchor = ref(true);
const links: Record<string, HTMLElement> = {};
let isScrolling = false;
let currentScrollTop = 0;

watch(
  () => currentAnchor.value,
  () => {
    Object.keys(hrefShow.value).forEach(v => {
      hrefShow.value[v] = false;
    });
    const parentHref = findParentHref(currentAnchor.value, hrefMap.value);
    hrefShow.value[parentHref] = true;
  },
);

const collapseCls = computed(() => {
  return !showAnchor.value
    ? ['anchor__collapse-fixed', 'anchor__collapse']
    : ['anchor__collapse'];
});

const arrowIcon = computed(() => {
  return showAnchor.value ? ArrowRightPng : ArrowLeftPng;
});

const addLink = (state: AnchorLinkState) => {
  links[state.href] = state.el;
};

const removeLink = (href: string) => {
  delete links[href];
};

const updateShow = (val: boolean) => {
  showAnchor.value = val;
};

const setCurrentAnchor = (href: string) => {
  if (currentAnchor.value !== href) {
    currentAnchor.value = href;
    emit('change', href);
  }
};

let clearAnimate: (() => void) | null = null;

// 滚动到指定元素
const scrollToAnchor = (href: string) => {
  const target = getElement(href);
  if (!target) return;
  if (clearAnimate) clearAnimate();
  isScrolling = true;
  const scrollEle = getScrollElement(target as HTMLElement, containerEl.value!);
  const distance = getOffsetTopDistance(target as HTMLElement, scrollEle);
  const max = scrollEle.scrollHeight - scrollEle.clientHeight;
  const to = Math.min(distance - props.offset, max);
  clearAnimate = animateScrollTo(
    containerEl.value!,
    currentScrollTop,
    to,
    props.duration,
    () => {
      setTimeout(() => {
        isScrolling = false;
      }, 20);
    },
  );
};

const scrollTo = (href?: string) => {
  if (href) {
    setCurrentAnchor(href);
    scrollToAnchor(href);
  }
};

const handleClick = (e: MouseEvent, href?: string) => {
  emit('click', e, href as string);
  onExpand(href!);
  scrollTo(href);
};

const handleScroll = throttleByRaf(() => {
  currentScrollTop = window.scrollY;
  const currentHref = getCurrentHref();
  if (isScrolling || currentHref == undefined) return;
  setCurrentAnchor(currentHref as string);
});

const getCurrentHref = () => {
  const scrollTop = window.scrollY;
  const anchorTopList: { top: number; href: string }[] = [];
  for (const href of Object.keys(links)) {
    const target = getElement(href);
    if (!target) continue;
    const scrollEle = getScrollElement(
      target as HTMLElement,
      containerEl.value!,
    );
    const distance = getOffsetTopDistance(target as HTMLElement, scrollEle);
    anchorTopList.push({
      top: distance - props.offset,
      href,
    });
  }
  anchorTopList.sort((prev, next) => prev.top - next.top);

  for (let i = 0; i < anchorTopList.length; i++) {
    const item = anchorTopList[i];
    const next = anchorTopList[i + 1];

    if (i === 0 && scrollTop === 0) {
      return '';
    }
    if (item.top <= scrollTop && (!next || next.top > scrollTop)) {
      return item.href;
    }
  }
};

const onExpand = (href: string) => {
  const tempStatus = hrefShow.value[href];
  Object.keys(hrefShow.value).forEach(v => {
    hrefShow.value[v] = false;
  });
  const parentHref = findParentHref(href, hrefMap.value);
  hrefShow.value[parentHref] = !tempStatus;
};

onMounted(() => {
  hrefMap.value = generateHrefMap(props.anchorList);
  hrefShow.value = generateHrefShow(props.anchorList);
  console.log(hrefShow.value);
  containerEl.value = window;
  window.addEventListener('scroll', handleScroll);
  const hash = decodeURIComponent(window.location.hash);
  const target = getElement(hash);
  if (target) {
    scrollTo(hash);
  } else {
    handleScroll();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

provide(anchorKey, {
  hrefShow,
  hrefMap,
  currentAnchor,
  addLink,
  removeLink,
  handleClick,
  onExpand,
});

defineExpose({
  updateShow,
});
</script>
<style scoped lang="less">
.anchor {
  position: relative;
  &__body {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #ededed;
    width: 300px;
    padding: 0 24px;
    box-sizing: border-box;
  }
  &__collapse {
    position: absolute;
    right: -18px;
    top: 10px;
    width: 18px;
    height: 34px;
    background: #b0b7bf;
    border-radius: 0px 4px 4px 0px;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    img {
      width: 12px;
      height: 12px;
    }
    &-fixed {
      position: fixed;
      top: 158px;
      left: 0;
      right: auto;
    }
  }
  &__title {
    font-weight: 600;
    font-size: 20px;
    color: #202d31;
    line-height: 24px;
    padding: 18px 0;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 21px;
  }
  &__item {
    &:last-child {
      margin-bottom: 0;
    }
    :deep(&__link) {
      a {
        display: inline-block;
        width: 224px;
        font-weight: 500;
        font-size: 14px;
        color: #202d31;
        line-height: 22px;
        margin-bottom: 26px;
        text-decoration: none;
      }
      .is-active {
        color: #0acda9;
      }
    }
  }
  &__list__sub {
    margin-left: 12px;
    a {
      color: rgba(32, 45, 49, 0.64);
      margin-bottom: 22px;
    }
  }
}
</style>
