export interface BinanceOfferAnalysis {
  targetAmount: number;
  availableAmount: number;
  coveragePercentage: number;
  weightedAveragePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  offersUsed: Array<{
    price: number;
    amount: number;
    advertiser: string;
    userGrade: number;
  }>;
  totalCost: number;
  costBreakdown: Array<{
    price: number;
    amount: number;
    cost: number;
    advertiser: string;
  }>;
}

export function analyzeBinanceOffers(
  offers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
  }>,
  targetAmount: number
): BinanceOfferAnalysis {
  let remainingAmount = targetAmount;
  const usedOffers: Array<{
    price: number;
    amount: number;
    advertiser: string;
    userGrade: number;
  }> = [];
  let totalWeightedPrice = 0;
  let totalUsedAmount = 0;

  // Sort offers by price (lowest first) to get the best deals
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

  for (const offer of sortedOffers) {
    if (remainingAmount <= 0) break;

    // Calculate how much we can take from this offer
    const amountToTake = Math.min(remainingAmount, offer.availableAmount);

    if (amountToTake > 0) {
      usedOffers.push({
        price: offer.price,
        amount: amountToTake,
        advertiser: offer.advertiser,
        userGrade: offer.userGrade,
      });

      totalWeightedPrice += offer.price * amountToTake;
      totalUsedAmount += amountToTake;
      remainingAmount -= amountToTake;
    }
  }

  const weightedAveragePrice =
    totalUsedAmount > 0
      ? Math.round((totalWeightedPrice / totalUsedAmount) * 100) / 100
      : 0;

  const priceRange = {
    min:
      usedOffers.length > 0 ? Math.min(...usedOffers.map((o) => o.price)) : 0,
    max:
      usedOffers.length > 0 ? Math.max(...usedOffers.map((o) => o.price)) : 0,
  };

  const costBreakdown = usedOffers.map((offer) => ({
    price: offer.price,
    amount: offer.amount,
    cost: Math.round(offer.price * offer.amount * 100) / 100,
    advertiser: offer.advertiser,
  }));

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0);

  return {
    targetAmount,
    availableAmount: totalUsedAmount,
    coveragePercentage: Math.round((totalUsedAmount / targetAmount) * 100),
    weightedAveragePrice,
    priceRange,
    offersUsed: usedOffers,
    totalCost: Math.round(totalCost * 100) / 100,
    costBreakdown,
  };
}

export function formatBinanceAnalysis(analysis: BinanceOfferAnalysis): string {
  const lines = [
    `📊 Binance P2P Analysis for ${analysis.targetAmount.toLocaleString()} USDT`,
    `💰 Available: ${analysis.availableAmount.toLocaleString()} USDT (${analysis.coveragePercentage}% coverage)`,
    `📈 Weighted Average Price: ${analysis.weightedAveragePrice} BOB`,
    `📊 Price Range: ${analysis.priceRange.min} - ${analysis.priceRange.max} BOB`,
    `💵 Total Cost: ${analysis.totalCost.toLocaleString()} BOB`,
    `🤝 Offers Used: ${analysis.offersUsed.length}`,
    "",
    "📋 Cost Breakdown:",
    ...analysis.costBreakdown.map(
      (item, index) =>
        `${index + 1}. ${item.advertiser} - ${item.amount.toLocaleString()} USDT @ ${item.price} BOB = ${item.cost.toLocaleString()} BOB`
    ),
    "",
    "💡 Strategy: Aggregated multiple offers to meet large order requirements",
  ];

  return lines.join("\n");
}

export function calculateOptimalOrderSize(
  availableOffers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
  }>,
  maxBudget: number
): {
  optimalAmount: number;
  totalCost: number;
  averagePrice: number;
} {
  const sortedOffers = [...availableOffers].sort((a, b) => a.price - b.price);

  let totalAmount = 0;
  let totalCost = 0;
  let totalWeightedPrice = 0;

  for (const offer of sortedOffers) {
    const maxAmountForBudget = (maxBudget - totalCost) / offer.price;
    const amountToTake = Math.min(offer.availableAmount, maxAmountForBudget);

    if (
      amountToTake > 0 &&
      totalCost + amountToTake * offer.price <= maxBudget
    ) {
      totalAmount += amountToTake;
      totalCost += amountToTake * offer.price;
      totalWeightedPrice += offer.price * amountToTake;
    }
  }

  const averagePrice = totalAmount > 0 ? totalWeightedPrice / totalAmount : 0;

  return {
    optimalAmount: Math.round(totalAmount * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
  };
}
