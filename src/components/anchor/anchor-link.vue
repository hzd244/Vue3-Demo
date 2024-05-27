<template>
  <div class="anchor__item__link">
    <a
      ref="linkRef"
      :class="{ 'is-active': currentAnchor === href }"
      :href="href"
      @click="handleClick"
    >
      <slot>{{ title }}</slot>
    </a>
    <img
      v-if="showArrow"
      :src="ArrowBottomPng"
      @click="onExpand(href!)"
      :class="{ 'arrow-active': arrowActive }"
      alt=""
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { anchorKey } from './constants';
import ArrowBottomPng from '@/assets/anchor/anchor-arrow-bottom.png';
import { findParentHref } from './anchor.helper';

const props = defineProps({
  title: String,
  href: String,
  showArrow: Boolean,
});

const linkRef = ref<HTMLElement | null>(null);

const {
  hrefShow,
  hrefMap,
  currentAnchor,
  addLink,
  removeLink,
  handleClick: contextHandleClick,
  onExpand,
} = inject(anchorKey)!;

const handleClick = (e: MouseEvent) => {
  contextHandleClick(e, props.href);
};

const arrowActive = computed(() => {
  const parentHref = findParentHref(props.href as string, hrefMap.value);
  return hrefShow.value[parentHref];
});

watch(
  () => props.href,
  (val, oldVal) => {
    nextTick(() => {
      if (oldVal) removeLink(oldVal);
      if (val) {
        addLink({
          href: val,
          el: linkRef.value!,
        });
      }
    });
  },
);

onMounted(() => {
  const { href } = props;
  if (href) {
    addLink({
      href,
      el: linkRef.value!,
    });
  }
});

onBeforeUnmount(() => {
  const { href } = props;
  if (href) {
    removeLink(href);
  }
});
</script>

<style scoped lang="less">
.anchor__item__link {
  position: relative;
  img {
    position: absolute;
    right: 0;
    top: 4px;
    width: 16px;
    height: 16px;
    transition: all 0.5s;
    cursor: pointer;
  }
  .arrow-active {
    transform: rotate(180deg);
  }
}
</style>
