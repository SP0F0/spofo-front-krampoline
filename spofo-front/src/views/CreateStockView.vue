<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { focusOn } from '@/components/common/utils';
import { StockCreate } from '@/components/models/stock-create';
import type { FormInstance } from 'element-plus';
import type { Stock } from '@/components/models/stock';
import stockService from '@/components/services/stock-service';
import portfolioService from '@/components/services/portfolio-service';

const route = useRoute();
const router = useRouter();
const searchedStocks = ref<Stock[]>();
const portfolioId = parseInt(route.query.portfolioId as string, 10);

const searchKeyword = ref('');
const searchKeywordRef = ref<HTMLElement>();
const stockCreateForm = ref(new StockCreate('B'));
const portfolioStockFormRef = ref<FormInstance>();
const searchTimeoutId = ref<ReturnType<typeof setTimeout> | undefined>();
const currentPriceCheck = ref(false);

const stockInfo = ref({
  stockName: '선택된 종목이 없습니다.',
  stockCode: '종목을 선택해주세요.'
});

onMounted(() => focusOn(searchKeywordRef.value));

const disabledDate = (time: Date) => {
  const date = new Date();
  return time.getTime() < date.setMonth(date.getMonth() - 1);
};

const shortcuts = [
  {
    text: '오늘',
    value: new Date()
  }
];

const clear = () => {
  portfolioStockFormRef.value?.resetFields();
  stockCreateForm.value = new StockCreate('B');
  focusOn(searchKeywordRef.value);
};

const selectStock = (code: string, name: string) => {
  stockCreateForm.value.code = code;
  stockInfo.value.stockCode = code;
  stockInfo.value.stockName = name;
};

const applyCurrentPrice = () => {
  if (
    !stockCreateForm.value.applyCurrentPrice &&
    !currentPriceCheck.value &&
    stockCreateForm.value.code
  ) {
    stockService
      .getStock(stockCreateForm.value.code)
      .then((response) => (stockCreateForm.value.avgPrice = response.data.price))
      .catch((error) => console.log(error));
  }
};

const createStock = (callback: any) => {
  portfolioService
    .createStock(portfolioId, stockCreateForm.value)
    .then(() => {
      ElNotification({
        title: '성공',
        message: `${stockInfo.value.stockName} 종목을 추가매수 하였습니다.`,
        position: 'bottom-left',
        type: 'success'
      });
      callback();
    })
    .catch(() =>
      ElNotification({
        title: '에러',
        message: `${stockInfo.value.stockName} 종목을 추가매수에 실패하였습니다.`,
        position: 'bottom-left',
        type: 'error'
      })
    );
};

const goBack = () => {
  router.push({
    name: 'portfolio',
    query: { portfolioId: portfolioId }
  });
}

const searchStocks = () => {
  if (!searchKeyword.value.trim()) {
    return;
  }

  if (searchTimeoutId.value) {
    clearTimeout(searchTimeoutId.value);
  }

  searchTimeoutId.value = setTimeout(() => {
    stockService
      .searchStocks(searchKeyword.value)
      .then((response) => (searchedStocks.value = response.data))
      .catch((error) =>
        ElNotification({
          title: '에러',
          message: `${searchKeyword.value} 검색에 실패하였습니다.`,
          position: 'bottom-left',
          type: 'error'
        })
      );
  }, 1000);
};
</script>

<template>
  <div class="create-stock-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card" shadow="always">
          <div class="card-header">
            <el-row align="middle">
              <el-col :span="24">
                <el-input
                  v-model="searchKeyword"
                  size="large"
                  clearable
                  placeholder="검색할 종목명 혹은 종목코드를 입력해 주세요."
                  :suffix-icon="Search"
                  ref="searchKeywordRef"
                  @keyup="searchStocks"
              /></el-col>
            </el-row>
          </div>
          <div class="card-body">
            <el-form
              ref="portfolioStockFormRef"
              label-width="80"
              class="create-stock-form"
              :model="stockCreateForm"
            >
              <el-row>
                <el-col :span="24" class="f-big"> {{ stockInfo.stockName }} </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="23"> {{ stockInfo.stockCode }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="매수날짜" prop="tradeDate">
                    <el-date-picker
                      v-model="stockCreateForm.tradeDate"
                      type="date"
                      placeholder="매수날짜"
                      :disabled-date="disabledDate"
                      :shortcuts="shortcuts"
                      :editable="false"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="수량" prop="quantity">
                    <el-input-number
                      v-model="stockCreateForm.quantity"
                      :min="0"
                      :max="999999999999999.999999999999999"
                      :controls="false"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="매수가" prop="price">
                    <el-input-number
                      v-model="stockCreateForm.avgPrice"
                      :min="0"
                      :controls="false"
                    />
                    <el-checkbox
                      v-model="currentPriceCheck"
                      class="ml-2"
                      label="현재가 적용"
                      name="type"
                      @click="applyCurrentPrice"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="button-container">
                <el-row align="middle">
                  <el-col :span="24">
                    <el-button color="#112D4E" round @click="clear"> 초기화 </el-button>
                    <el-button
                      color="#112D4E"
                      round
                      @click="
                        createStock(goBack)
                      "
                      :disabled="
                        !stockCreateForm.code ||
                        stockCreateForm.quantity <= 0 ||
                        stockCreateForm.avgPrice <= 0 ||
                        !stockCreateForm.tradeDate
                      "
                    >
                      추가매수
                    </el-button>
                    <el-button
                      color="#112D4E"
                      round
                      @click="createStock(clear)"
                      :disabled="
                        !stockCreateForm.code ||
                        stockCreateForm.quantity <= 0 ||
                        stockCreateForm.avgPrice <= 0 ||
                        !stockCreateForm.tradeDate
                      "
                    >
                      저장하고 새로 추가
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never">
          <div class="card-header">
            <el-row align="middle">
              <el-col :span="24" class="f-small"> 검색결과 </el-col>
            </el-row>
          </div>
          <div class="card-body" v-for="stock in searchedStocks" :key="stock.stockCode">
            <div
              class="stock-card cur-pointer"
              @click="selectStock(stock.stockCode as string, stock.name as string)"
            >
              <el-row class="stock-card-content" align="middle">
                <el-col :span="4">
                  <el-avatar :size="60" :src="stock.imageUrl" />
                </el-col>
                <el-col :span="14">
                  <el-col :span="24"> {{ stock.name }} </el-col>
                  <el-col :span="24"> {{ stock.stockCode }} </el-col>
                </el-col>
                <el-col :span="6"> {{ stock.market }} </el-col>
              </el-row>
            </div>
          </div>
          <div v-if="!searchedStocks">
            <el-result icon="error" title="검색 결과가 없습니다."> </el-result>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
