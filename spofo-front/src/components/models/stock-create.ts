class StockCreate {
  type?: string;
  code?: string;
  avgPrice: number;
  tradeDate: Date;
  quantity: number;
  applyCurrentPrice?: boolean;

  constructor(
    type?: string,
    stockCode?: string,
    avgPrice = 0,
    tradeDate = new Date(),
    quantity = 0,
    applyCurrentPrice = false
  ) {
    this.type = type;
    this.code = stockCode;
    this.avgPrice = avgPrice;
    this.tradeDate = tradeDate;
    this.quantity = quantity;
    this.applyCurrentPrice = applyCurrentPrice;
  }
}

export { StockCreate };
