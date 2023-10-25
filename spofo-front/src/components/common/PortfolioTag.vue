<script setup lang="ts">
import { ref, toRef } from 'vue';

const props = defineProps(['tag']);
const tag = toRef(props.tag);
</script>

<template>
  <el-tag class="mx-1 tag color-black" effect="dark" color="#FFCC1D" v-if="tag == 'REAL'">
    실제
  </el-tag>
  <el-tag class="mx-1 tag color-white" effect="dark" color="#35A29F" v-else-if="tag == 'FAKE'">
    모의
  </el-tag>
  <el-tag class="mx-1 tag color-white" effect="dark" color="#FF6E31" v-else> 계좌 연동 </el-tag>
</template>

<style scoped></style>
