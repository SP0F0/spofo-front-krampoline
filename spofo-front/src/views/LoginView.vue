<script setup lang="ts">
const kakaLogin = () => {
  // 카카오
  const kakaoAuthRequestUrl = import.meta.env.VITE_KAKAO_AUTH_REQUEST_URL;
  const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  window.location.href = `${kakaoAuthRequestUrl}/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&response_type=code&scope=openid`;
};

/*
const naverLogin = () => {};

const googleLogin = () => {};
 */
</script>

<template>
  <div class="login txt-center">
    <h1 class="p-1">로그인</h1>
    <div class="button-container">
      <el-row justify="center">
        <el-col :span="24">
          <el-button class="login-btn" color="#FEE500" round @click="kakaLogin">
            <img src="../assets/images/kakao_logo.png" alt="카카오 로그인 버튼" />
            카카오 로그인
          </el-button>
        </el-col>
      </el-row>
      <!--
      <el-row justify="center">
        <el-col :span="24">
          <el-button class="login-btn" color="#1EC800" round @click="naverLogin">
            <img src="../assets/images/naver_logo.png" alt="네이버 로그인 버튼" />
            네이버 로그인
          </el-button>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="24">
          <el-button class="login-btn" color="#FFF" round @click="googleLogin">
            <img src="../assets/images/google_logo.png" alt="구글 로그인 버튼" />
            구글 로그인
          </el-button>
        </el-col>
      </el-row>
      -->
    </div>
  </div>
</template>

<style></style>
