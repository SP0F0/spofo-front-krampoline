<script setup lang="ts">
import { onMounted, ref, toRef } from 'vue';
import { focusOn } from '@/components/common/utils';
import { ElMessageBox, ElNotification } from 'element-plus';
import { PortfolioStock } from '@/components/models/portfolio-stock';
import { StockAdd } from '@/components/models/stock-add';
import portfolioService from '@/components/services/portfolio-service';
import type { FormInstance } from 'element-plus';
import stockService from "@/components/services/stock-service";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(['vars']);
const vars = toRef(props, 'vars');
const portfolioId = toRef(props.vars.portfolioId);
const stockCode = toRef(props.vars.stockCode);
const stockId = toRef(props.vars.stockId);
const stockQuantityRef = ref<HTMLElement>();
const portfolioStockFormRef = ref<FormInstance>();
const portfolioStock = ref(new PortfolioStock());
const stockAddForm = ref(new StockAdd(stockCode.value));
const currentPriceCheck = ref(false);
const emits = defineEmits(['close']);

onMounted(async () => {
   portfolioService.getHoldingStock(portfolioId.value, stockId.value)
   .then((response) => (portfolioStock.value = response.data))
   .catch((error) => {
     console.log(error);
   });
});

const scaleIn = () =>
  portfolioService
    .addTradeLog(vars.value.portfolioId, stockAddForm.value, stockId.value)
    .then(() => {
      ElNotification({
        title: '성공',
        message: `${portfolioStock.value.name} 종목을 ${stockAddForm.value.quantity}주 추가 매수하였습니다.`,
        position: 'bottom-left',
        type: 'success'
      });
      close();
    })
    .catch(() =>
      ElNotification({
        title: '에러',
        message: `${portfolioStock.value.name} 종목 추가 매수에 실패하였습니다.`,
        position: 'bottom-left',
        type: 'error'
      })
    );

const applyCurrentPrice = () => {
  if (
    !stockAddForm.value.applyCurrentPrice &&
    !currentPriceCheck.value &&
    stockAddForm.value.code
  ) {
    stockService
    .getStock(stockAddForm.value.code)
    .then((response) => (stockAddForm.value.avgPrice = response.data.price))
    .catch((error) => console.log(error));
  }
};

const closeScaleInPopup = (done: () => void) => {
  ElMessageBox.confirm('추가매수를 취소하시겠습니까?', '알림', {
    confirmButtonText: '취소할래요',
    cancelButtonText: '아니요'
  }).then(() => {
    close();
    done();
  });
};

const close = () => {
  clear();
  emits('close');
};

const clear = () => {
  portfolioStockFormRef.value?.resetFields();
  stockAddForm.value = new StockAdd(stockCode.value);
};

const popupOpened = () => focusOn(stockQuantityRef.value);

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
</script>

<template>
  <el-dialog width="30%" :before-close="closeScaleInPopup" @opened="popupOpened">
    <div class="popup">
      <div class="add-stock-container">
        <div class="card-header f-big">추가 매수</div>
        <div class="card-body">
          <el-row align="middle">
            <el-col :span="4">
              <el-avatar :size="60" />
            </el-col>
            <el-col :span="16">
              <el-row align="middle">
                <el-col :span="24" class="f-small"> {{ portfolioStock.name }} </el-col>
                <el-col :span="24"> {{ portfolioStock.code }} </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div class="statistic">
            <el-row align="middle">
              <el-col :span="24">
                <el-row class="title row" align="middle">
                  <el-col :span="6"></el-col>
                  <el-col :span="6">수량</el-col>
                  <el-col :span="6">매수가</el-col>
                  <el-col :span="6">투자금액</el-col>
                </el-row>
                <el-row class="row" align="middle">
                  <el-col :span="6" class="title">현재</el-col>
                  <el-col :span="6">{{ portfolioStock.quantity }}</el-col>
                  <el-col :span="6">{{ portfolioStock.avgPrice }}</el-col>
                  <el-col :span="6">{{ portfolioStock.totalAsset }}</el-col>
                </el-row>
                <el-row class="row" align="middle">
                  <el-col :span="6" class="title">추가</el-col>
                  <el-col :span="6">{{ stockAddForm.quantity }}</el-col>
                  <el-col :span="6">{{ stockAddForm.avgPrice }}</el-col>
                  <el-col :span="6">{{ stockAddForm.quantity * stockAddForm.avgPrice }}</el-col>
                </el-row>
                <el-row class="row" align="middle">
                  <el-col :span="6" class="title">합계</el-col>
                  <el-col :span="6">{{ portfolioStock.quantity + stockAddForm.quantity }}</el-col>
                  <el-col :span="6">{{ portfolioStock.avgPrice + stockAddForm.avgPrice }}</el-col>
                  <el-col :span="6">{{
                    portfolioStock.totalAsset + stockAddForm.quantity * stockAddForm.avgPrice
                  }}</el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <el-form
            class="add-stock-form"
            ref="portfolioStockFormRef"
            label-position="left"
            label-width="80"
            :model="stockAddForm"
          >
            <el-form-item label="매수날짜" prop="tradeDate">
              <el-date-picker
                v-model="stockAddForm.tradeDate"
                type="date"
                placeholder="매수날짜"
                :disabled-date="disabledDate"
                :shortcuts="shortcuts"
                :editable="false"
              />
            </el-form-item>
            <el-form-item label="수량" prop="quantity">
              <el-input-number
                v-model="stockAddForm.quantity"
                :min="0"
                :max="999999999999999.999999999999999"
                :controls="false"
                ref="stockQuantityRef"
              />
            </el-form-item>
            <el-form-item label="매수가" prop="price">
              <el-input-number v-model="stockAddForm.avgPrice" :min="0" :controls="false" />
              <el-checkbox
                class="ml-2"
                label="현재가 적용"
                v-model="currentPriceCheck"
                name="type"
                @click="applyCurrentPrice"
              />
            </el-form-item>
          </el-form>

          <div class="button-container">
            <el-row align="middle">
              <el-col :span="24">
                <el-button color="#112D4E" round @click="clear"> 초기화 </el-button>
                <el-button
                  color="#112D4E"
                  round
                  @click="scaleIn()"
                  :disabled="stockAddForm.avgPrice == 0 || stockAddForm.quantity == 0"
                >
                  추가매수
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped></style>
