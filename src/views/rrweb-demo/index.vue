<template>
  <main>
    <header>
      <el-button @click="onRecord" type="primary">录制</el-button>
      <el-button @click="onReplay" type="success">回放</el-button>
      <el-button @click="goBack">返回</el-button>
    </header>
    <!-- 展示回放的DOM -->
    <section v-if="showReplay" ref="replayer"></section>
    <!-- 表单 -->
    <section v-else>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        label-width="auto"
      >
        <el-form-item label="用户名">
          <el-input v-model="ruleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model.number="ruleForm.age" />
        </el-form-item>
        <el-form-item style="margin-left: 55px">
          <el-button type="primary"> 提交 </el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { useRecord } from '@/hooks/use-record';
import 'rrweb-player/dist/style.css';

const { replayer, showReplay, onRecord, onReplay, goBack } = useRecord();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  pass: '',
  name: '',
  age: '',
});
</script>

<style scoped lang="less">
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 50px;
  header {
    margin-bottom: 20px;
  }
  section {
    border: 1px solid rgb(198, 194, 194);
    padding: 20px;
    border-radius: 4px;
  }
}
</style>
