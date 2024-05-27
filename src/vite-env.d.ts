/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue-router/auto';

declare module 'lodash';
declare module 'prettier/standalone';
declare module 'prettier/parser-html';
declare module 'prettier/parser-babel';
declare module 'prettier/parser-postcss';
declare module 'node-forge';
