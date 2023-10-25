import axios from '../common/axios-config';
import type { PortfolioCreate } from '@/components/models/portfolio-create';
import type { PortfolioModify } from '@/components/models/portfolio-modify';
import type { StockCreate } from '@/components/models/stock-create';
import type { StockAdd } from '@/components/models/stock-add';

class PortfolioService {
  portfolioServer = import.meta.env.VITE_PORTFOLIO_SERVER;

  getPortfoliosTotal() {
    return axios.get(this.portfolioServer + '/portfolios/total');
  }

  getPortfolioSimples() {
    console.log(this.portfolioServer);
    return axios.get(this.portfolioServer + '/portfolios');
  }

  getPortfolio(portfolioId: number) {
    return axios.get(this.portfolioServer + `/portfolios/${portfolioId}`);
  }

  getPortfolioTotal(portfolioId: number) {
    return axios.get(this.portfolioServer + `/portfolios/${portfolioId}/total`);
  }

  getPortfolioStocks(portfolioId: number) {
    return axios.get(this.portfolioServer + `/portfolios/${portfolioId}/stocks`);
  }

  createPortfolio(portfolio: PortfolioCreate) {
    return axios.post(this.portfolioServer + '/portfolios', portfolio);
  }

  modifyPortfolio(portfolio: PortfolioModify) {
    return axios.put(this.portfolioServer + `/portfolios/${portfolio.id}`, portfolio);
  }

  createStock(portfolioId: number, stock: StockAdd) {
    return axios.post(this.portfolioServer + `/portfolios/${portfolioId}/stocks`, stock);
  }

  addTradeLog(portfolioId: number, stock: StockAdd, stockId: number) {
    return axios.post(this.portfolioServer + `/portfolios/${portfolioId}/stocks/${stockId}`, stock);
  }

  deletePortfolio(portfolioId: number) {
    return axios.delete(this.portfolioServer + `/portfolios/${portfolioId}`);
  }

  deleteStock(portfolioId: number, stockId: number) {
    return axios.delete(this.portfolioServer + `/portfolios/${portfolioId}/stocks/${stockId}`);
  }

  getHoldingStock(portfolioId: number, stockId: number) {
    return axios.get(this.portfolioServer + `/portfolios/${portfolioId}/stocks/${stockId}`);
  }
}

const portfolioService = new PortfolioService();

export default portfolioService;
