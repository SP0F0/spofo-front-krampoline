class TradeLog {
  type?: string;
  tradeDate?: string;
  avgPrice?: number;
  quantity?: number;
  gain?: number;
  totalPrice?: number;

  constructor(
    type?: string,
    tradeDate?: string,
    avgPrice?: number,
    quantity?: number,
    gain?: number,
    totalPrice?: number
  ) {
    this.type = type;
    this.tradeDate = tradeDate;
    this.avgPrice = avgPrice;
    this.quantity = quantity;
    this.gain = gain;
    this.totalPrice = totalPrice;
  }
}

export { TradeLog };
