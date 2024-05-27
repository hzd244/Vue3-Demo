import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/views',
      exclude: ['**/components/*.vue'],
      extensions: ['.vue'],
    }),
    vue(),
  ],
  resolve: {
    // 路径别名
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    // 使用路径别名时想要省略的后缀名，可以自己增减
    extensions: ['.js', '.json', '.ts', '.vue'],
  },
});
