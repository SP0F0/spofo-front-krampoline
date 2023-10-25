class PortfolioCreate {
  name?: string;
  description?: string;
  currency?: string;
  type?: string;

  constructor(name?: string, description?: string, currency = 'KRW', type = 'REAL') {
    this.name = name;
    this.description = description;
    this.currency = currency;
    this.type = type;
  }
}

export { PortfolioCreate };
