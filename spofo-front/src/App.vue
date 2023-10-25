<script setup lang="ts">
import { ref } from 'vue';
import { loginStore } from '@/stores/login-store';
import { useRouter, RouterView } from 'vue-router';
import type { DropdownInstance } from 'element-plus';
import { ElNotification } from 'element-plus';

const useLoginStore = loginStore();
const router = useRouter();
const memberDropdown = ref<DropdownInstance>();

const logout = function () {
  useLoginStore.logout();
  router.push({ name: 'main' });

  ElNotification({
    title: '알림',
    message: '로그아웃 하였습니다.',
    position: 'bottom-left',
    type: 'success'
  });
};

function showDropdown() {
  if (!memberDropdown.value) return;
  memberDropdown.value.handleOpen();
}
</script>

<template>
  <el-row :gutter="10" align="middle" class="header">
    <el-col :span="4">
      <el-link :underline="false" @click="router.push({ name: 'main' })">
        <!-- 로고가 들어갈 위치 -->
        <img class="main-logo" src="./assets/images/logo.png" alt="로고 이미지" />
      </el-link>
    </el-col>
    <el-col :span="4" class="header-content">
      <el-link :underline="false" @click="router.push({ name: 'portfolios' })">포트폴리오</el-link>
    </el-col>
    <!-- 추후 상단바에 메뉴가 추가되면 넣을 위치 -->
    <el-col :span="4" class="header-content"> </el-col>
    <el-col :span="4" class="header-content"> </el-col>
    <el-col :span="4" class="header-content"> </el-col>
    <el-col class="header-content" :span="4" v-if="useLoginStore.isAuthedMember">
      <el-dropdown ref="memberDropdown" trigger="contextmenu" size="large">
        <span class="el-dropdown-link">
          <el-link :underline="false" @click="showDropdown">
            <el-avatar :size="50" :src="useLoginStore.getMember.imagePath" />
          </el-link>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-link :underline="false" @click="logout">로그아웃</el-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <el-col :span="4" v-else class="txt-center">
      <el-link :underline="false" @click="router.push({ name: 'login' })">로그인</el-link>
    </el-col>
  </el-row>
  <div class="container">
    <RouterView />
  </div>
</template>
