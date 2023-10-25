<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import portfolioService from '../components/services/portfolio-service';
import { PortfoliosSummary } from '@/components/models/portfolios-summary';
import type { PortfolioSimple } from '@/components/models/portfolio-simple';
import { Plus, Setting } from '@element-plus/icons-vue';
import PortfolioTag from '@/components/common/PortfolioTag.vue';
import { PortfolioModify } from '@/components/models/portfolio-modify';

const router = useRouter();
const filterOption = ref('전체');
const portfoliosSummary = ref(new PortfoliosSummary());
const portfolioSimples = ref<PortfolioSimple[]>();

onMounted(() => {
  getPortfoliosTotal();
  getPortfolioSimples();
});

const getPortfolioSimples = () =>
  portfolioService
    .getPortfolioSimples()
    .then((response) => (portfolioSimples.value = response.data))
    .catch((error) => console.log(error));

const getPortfoliosTotal = () =>
  portfolioService
    .getPortfoliosTotal()
    .then((response) => (portfoliosSummary.value = response.data))
    .catch((error) => console.log(error));

const viewPortfolio = (portfolioId: number) => {
  router.push({
    name: 'portfolio',
    query: { portfolioId: portfolioId }
  });
};

const switchInclude = (portfolio: PortfolioSimple) => {
  const modifiedPortfolio = new PortfolioModify(
    portfolio.id,
    portfolio.name,
    portfolio.description,
    portfolio.currency,
    portfolio.type,
    portfolio.includeType
  );

  portfolioService
    .modifyPortfolio(modifiedPortfolio)
    .then((response) => {
      getPortfoliosTotal();
      getPortfolioSimples();
    })
    .catch((error) => console.log(error));
};

const changeFilterOption = () => {
  // API를 호출하여 회원 1명의 포트폴리오를 필터링하여 조회한다.
};
</script>

<template>
  <div class="portfolios-summary-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div class="card-header">
            <el-row align="middle">
              <el-col :span="23"></el-col>
              <el-col :span="1">
                <div class="text item">
                  <el-button type="info" circle link size="large">
                    <el-icon
                      size="30"
                      color="#000"
                      @click="router.push({ name: 'portfolioCreate' })"
                    >
                      <Plus />
                    </el-icon>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="card-body">
            <div class="card-body-header">
              <el-row>
                <el-col :span="24"><span class="f-small">총 자산</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <span class="f-big">
                    <strong>₩{{ portfoliosSummary?.totalAsset }}</strong>
                  </span>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="20">
                <span class="f-small">평가수익</span>
              </el-col>
              <el-col :span="4">
                <span class="f-small txt-right">₩{{ portfoliosSummary?.gain }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <span class="f-small">수익률</span>
              </el-col>
              <el-col :span="4">
                <span class="f-small txt-right">{{ portfoliosSummary?.gainRate }}%</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <span class="f-small">일간 수익률</span>
              </el-col>
              <el-col :span="4">
                <span class="f-small txt-right">{{ portfoliosSummary?.dailyGainRate }}%</span>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div class="card-header">
            <el-row align="middle">
              <el-col :span="24">
                <el-select
                  v-model="filterOption"
                  class="m-2"
                  placeholder="포트폴리오 구분"
                  size="large"
                  @change="changeFilterOption"
                >
                  <el-option key="전체" label="전체" value="전체" />
                  <el-option key="실제" label="실제" value="실제" />
                  <el-option key="모의" label="모의" value="모의" />
                  <el-option key="계좌 연동" label="계좌 연동" value="계좌 연동" />
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div class="card-body" v-for="item in portfolioSimples" :key="item.id">
            <div class="stock-card">
              <el-row class="stock-card-content" align="middle">
                <el-col :span="24">
                  <PortfolioTag v-if="item.type" :tag="item.type" />
                </el-col>
              </el-row>
              <el-row class="stock-card-content" align="middle">
                <el-col :span="21">
                  <el-link :underline="false" @click="viewPortfolio(item.id)">
                    {{ item.name }}
                  </el-link>
                </el-col>
                <el-col :span="3">
                  <el-switch
                    v-model="item.includeType"
                    style="--el-switch-on-color: #112d4e; --el-switch-off-color: #3f72af"
                    @click="switchInclude(item)"
                  />
                </el-col>
              </el-row>
              <el-row class="stock-card-content" align="middle">
                <el-col :span="24"> ₩{{ item.gain }} ({{ item.gainRate }}%) </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
