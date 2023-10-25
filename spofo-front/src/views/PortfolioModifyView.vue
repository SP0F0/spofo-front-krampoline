<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { focusOn } from '@/components/common/utils';
import { ElMessageBox, ElNotification } from 'element-plus';
import { PortfolioModify } from '@/components/models/portfolio-modify';
import portfolioService from '@/components/services/portfolio-service';
import type { FormInstance } from 'element-plus';

const props = defineProps(['portfolioId']);
const portfolioId = ref(props.portfolioId);
const portfolioNameRef = ref<HTMLElement>();
const portfolioModifyFormRef = ref<FormInstance>();
const portfolioModifyForm = ref(new PortfolioModify());
const emits = defineEmits(['close']);

onMounted(() => {
  portfolioService
    .getPortfolio(portfolioId.value)
    .then((response) => {
      portfolioModifyForm.value = response.data;
      console.log(response.data);
    })
    .catch((error) => console.log(error));
});

const modifyPortfolio = () => {
  portfolioService
    .modifyPortfolio(portfolioModifyForm.value)
    .then(() => {
      ElNotification({
        title: '성공',
        message: '포트폴리오를 수정하였습니다.',
        position: 'bottom-left',
        type: 'success'
      });
      close();
    })
    .catch(() =>
      ElNotification({
        title: '에러',
        message: '포트폴리오 수정에 실패했습니다.',
        position: 'bottom-left',
        type: 'error'
      })
    );
};

const popupOpened = () => focusOn(portfolioNameRef.value);

const closeConfirm = (done: () => void) => {
  ElMessageBox.confirm('수정하기를 취소하시겠습니까?', '알림', {
    confirmButtonText: '취소할래요',
    cancelButtonText: '아니요'
  }).then(() => {
    close();
    done();
  });
};

const close = () => {
  portfolioModifyFormRef.value?.resetFields();
  emits('close');
};
</script>

<template>
  <el-dialog width="30%" :before-close="closeConfirm" @opened="popupOpened">
    <div class="popup">
      <div class="card-header f-big">포트폴리오 수정</div>
      <div class="card-body">
        <el-form ref="portfolioModifyFormRef" :model="portfolioModifyForm" label-width="auto">
          <el-form-item label="포트폴리오 이름" prop="name">
            <el-input v-model="portfolioModifyForm.name" ref="portfolioNameRef" />
          </el-form-item>
          <el-form-item label="포트폴리오 설명" prop="description">
            <el-input v-model="portfolioModifyForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="기준통화" prop="currency">
            <el-radio-group v-model="portfolioModifyForm.currency" text-color="#FFF" fill="#3F72AF">
              <el-radio-button class="radio-btn" label="KRW"> 대한민국 원 (KRW) </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="분류" prop="type">
            <el-radio-group v-model="portfolioModifyForm.type" text-color="#FFF" fill="#FFCC1D">
              <el-radio-button class="radio-btn" label="REAL">실제 포트폴리오</el-radio-button>
              <el-radio-button class="radio-btn" label="FAKE">모의 포트폴리오</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="button-container">
            <el-button
              color="#112D4E"
              round
              @click="modifyPortfolio"
              :disabled="portfolioModifyForm.name?.trim() === '' ? true : false"
            >
              수정하기
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped></style>
