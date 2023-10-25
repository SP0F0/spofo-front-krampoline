class PortfoliosSummary {
  totalAsset: number;
  gain: number;
  gainRate: number;
  dailyGainRate: number;

  constructor(totalAsset = 0, gain = 0, gainRate = 0, dailyGainRate = 0) {
    this.totalAsset = totalAsset;
    this.gain = gain;
    this.gainRate = gainRate;
    this.dailyGainRate = dailyGainRate;
  }
}

export { PortfoliosSummary };
