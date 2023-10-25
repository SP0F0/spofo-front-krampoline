class Stock {
  stockCode?: string;
  name?: string;
  market?: string;
  imageUrl?: string;

  constructor(stockCode: string, name: string, market: string, imageUrl: string) {
    this.stockCode = stockCode;
    this.name = name;
    this.market = market;
    this.imageUrl = imageUrl;
  }
}

export { Stock };
