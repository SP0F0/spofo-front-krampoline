<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="main-container">
    <el-row :gutter="24">
      <el-col>
        <!-- 메인 이미지가 들어갈 위치 -->
        <div class="main-image-container">
          <div style="width: 100%">
            <img src="../assets/images/main_1.jpeg" style="max-width: 100%" />
          </div>
          <div style="width: 100%">
            <img src="../assets/images/main_2.jpeg" style="max-width: 100%" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col>
        <el-button class="login-btn" color="#DBE2EF" round @click="router.push({ name: 'login' })">
          시작하기
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style></style>
