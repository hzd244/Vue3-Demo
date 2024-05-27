import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Antd from 'ant-design-vue';
import './style/index.less';

const app = createApp(App);
app.use(Antd).use(ElementPlus).use(router).mount('#app');
