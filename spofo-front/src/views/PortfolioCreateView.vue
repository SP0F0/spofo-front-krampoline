<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { focusOn } from '@/components/common/utils';
import { PortfolioCreate } from '@/components/models/portfolio-create';
import { ElNotification } from 'element-plus';
import portfolioService from '@/components/services/portfolio-service';

const router = useRouter();
const portfolioNameRef = ref<HTMLElement>();
const portfolioCreateForm = ref(new PortfolioCreate());

onMounted(() => focusOn(portfolioNameRef.value));

const createPortfolio = () => {
  portfolioService
    .createPortfolio(portfolioCreateForm.value)
    .then(() => {
      ElNotification({
        title: '성공',
        message: '포트폴리오를 생성하였습니다.',
        position: 'bottom-left',
        type: 'success'
      });

      router.push({ name: 'portfolios' });
    })
    .catch(() =>
      ElNotification({
        title: '에러',
        message: '포트폴리오 생성에 실패했습니다.',
        position: 'bottom-left',
        type: 'error'
      })
    );
};
</script>

<template>
  <div class="portfolio-create-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card" shadow="never">
          <div class="card-header">포트폴리오 신규 추가</div>
          <div class="card-body">
            <el-form
              ref="formRef"
              :model="portfolioCreateForm"
              label-width="auto"
              label-position="top"
            >
              <el-form-item label="포트폴리오 이름" prop="name">
                <el-input
                  v-model="portfolioCreateForm.name"
                  placeholder="포트폴리오 이름을 입력해 주세요."
                  ref="portfolioNameRef"
                />
              </el-form-item>
              <el-form-item label="포트폴리오 설명" prop="description">
                <el-input
                  v-model="portfolioCreateForm.description"
                  type="textarea"
                  placeholder="포트폴리오 설명을 입력해 주세요."
                />
              </el-form-item>
              <el-form-item label="기준통화" prop="currency">
                <el-radio-group
                  v-model="portfolioCreateForm.currency"
                  text-color="#FFF"
                  fill="#3F72AF"
                >
                  <el-radio-button class="radio-btn" label="KRW">
                    대한민국 원 (KRW)
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="분류" prop="type">
                <el-radio-group v-model="portfolioCreateForm.type" text-color="#FFF" fill="#FFCC1D">
                  <el-radio-button class="radio-btn" label="REAL">실제 포트폴리오</el-radio-button>
                  <el-radio-button class="radio-btn" label="FAKE">모의 포트폴리오</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="button-container">
                <el-button
                  color="#112D4E"
                  round
                  @click="createPortfolio"
                  :disabled="!portfolioCreateForm.name"
                >
                  생성하기
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style></style>
