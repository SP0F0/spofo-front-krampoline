import axios from '../common/axios-config';

class StockService {
  stockServer = import.meta.env.VITE_STOCK_SERVER;

  searchStocks(keyword: string) {
    return axios.get(this.stockServer + `/stocks/search?keyword=${keyword}`);
  }

  getStock(stockCode: string) {
    return axios.get(this.stockServer + `/stocks/${stockCode}`);
  }
}

const stockService = new StockService();

export default stockService;
