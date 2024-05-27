<template>
  <div v-html="content"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // 根据需要选择样式
import { prettierCode } from '@/utils/tools';

const code = ref(`function helloWorld() {
        const a = 10;
        console.log('Hello, World!');
      }`);
const content = ref();

const highlightCode = (code: string) => {
  code = prettierCode(code);
  const highlightedCode = hljs.highlight(code, {
    language: 'javascript',
  }).value;
  return `<pre><code class="hljs javascript">${highlightedCode}</code></pre>`;
};

const replaceStr = (str: string) => {
  const regex = /<heightCode>(.*?)<\/heightCode>/g;
  let match;
  let heightCodeContents: string[] = [];

  while ((match = regex.exec(str)) !== null) {
    heightCodeContents.push(match[1]);
  }
  heightCodeContents.forEach(item => {
    item = highlightCode(item);
  });

  let currentIndex = 0;
  const replacedStr = str.replace(/<heightCode>.*?<\/heightCode>/g, () => {
    if (currentIndex < heightCodeContents.length) {
      const replacement = heightCodeContents[currentIndex];
      currentIndex++;
      return replacement;
    } else {
      return ''; // 如果数组元素不够用，则移除该标签及内容
    }
  });
  return replacedStr;
};

onMounted(() => {
  replaceStr('');
  code.value = prettierCode(code.value);
  const highlightedCode = hljs.highlight(code.value, {
    language: 'javascript',
  }).value;
  content.value = `<pre><code class="hljs javascript">${highlightedCode}</code></pre>`;
});
</script>

<style lang="less" scoped></style>
