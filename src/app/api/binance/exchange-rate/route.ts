import { NextResponse } from "next/server";

interface BinanceOffer {
  adv: {
    price: string;
    minSingleTransAmount?: string;
    maxSingleTransAmount?: string;
    advNo: string;
    dynamicMaxSingleTransAmount?: string;
    dynamicMaxSingleTransQuantity?: string;
    maxSingleTransQuantity?: string;
    minSingleTransQuantity?: string;
    priceNum?: string;
    quantity?: string;
    [key: string]: any; // Allow for unknown fields
  };
  advertiser: {
    nickName: string;
    userGrade: number;
    userNo: string;
  };
}

interface AggregatedOffer {
  totalAmount: number;
  weightedAveragePrice: number;
  offers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
  }>;
  priceRange: {
    min: number;
    max: number;
  };
}

export async function GET(request: Request) {
  let targetAmount = 0;

  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get("amount") || "100";
    targetAmount = parseFloat(amount);

    console.log("Fetching P2P price from Binance...", {
      amount,
      targetAmount,
    });

    // Configuration
    const BATCH_SIZE = 10; // Fetch 10 offers per page
    const MIN_USDT_THRESHOLD = 1000; // Minimum USDT to consider (ignore smaller offers)
    const MAX_PAGES = 50; // Maximum pages to prevent infinite loops

    // For very large amounts, use a smaller search amount to get more results
    const searchAmount = targetAmount > 50000 ? "10000" : amount;

    let allOffers: any[] = [];
    let page = 1;

    console.log(`Starting progressive batch loading for ${targetAmount} USDT`);
    console.log(`Strategy: Fetch batches of ${BATCH_SIZE}, filter >= ${MIN_USDT_THRESHOLD} USDT, prioritize by amount`);
    console.log(`Using search amount: ${searchAmount} USDT (target: ${targetAmount} USDT)`);

    // Keep fetching batches until we have enough offers to cover target amount
    while (page <= MAX_PAGES) {
      const currentTotal = allOffers.reduce((sum, o) => sum + o.availableAmount, 0);

      console.log(
        `Fetching batch ${page}... (accumulated: ${currentTotal.toFixed(0)} / ${targetAmount} USDT)`
      );

      try {
        const response = await fetch(
          "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (compatible; Next.js App)",
            },
            body: JSON.stringify({
              fiat: "BOB",
              page: page,
              rows: BATCH_SIZE,
              asset: "USDT",
              tradeType: "BUY",
              transAmount: searchAmount, // Use adjusted search amount
              sortType: "price",
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        if (!response.ok) {
          console.error(`Batch ${page} - API error: ${response.status}`);
          break;
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          console.error(`Batch ${page} - Invalid response`);
          break;
        }

        if (data.success === false) {
          console.error(`Batch ${page} - API returned success: false`);
          break;
        }

        // Extract offers array from response
        let offers = [];
        if (Array.isArray(data)) {
          offers = data;
        } else if (data.data && Array.isArray(data.data)) {
          offers = data.data;
        } else if (data.offers && Array.isArray(data.offers)) {
          offers = data.offers;
        } else {
          // Search for any array in the response
          for (const key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
              offers = data[key];
              break;
            }
          }
        }

        if (!offers || offers.length === 0) {
          console.log(`Batch ${page} - No more offers available`);
          break;
        }

        console.log(`Batch ${page} - Processing ${offers.length} offers`);

        // Filter and process offers: only >= MIN_USDT_THRESHOLD
        const processedOffers = offers
          .map((offer: any) => {
            try {
              if (!offer.adv?.price || typeof offer.adv.price !== "string") {
                return null;
              }

              const price = parseFloat(offer.adv.price);
              if (isNaN(price)) return null;

              // Extract available USDT amount
              const availableUSDT = parseFloat(
                offer.adv.surplusAmount ||
                  offer.adv.tradableQuantity ||
                  offer.adv.quantity ||
                  offer.adv.dynamicMaxSingleTransQuantity ||
                  offer.adv.maxSingleTransQuantity ||
                  "0"
              );

              const maxUSDT = parseFloat(
                offer.adv.maxSingleTransQuantity ||
                  offer.adv.maxSingleTransAmount ||
                  "999999"
              );

              // Fallback: estimate from BOB if USDT not found
              let finalAvailableUSDT = availableUSDT;
              if (availableUSDT === 0 && price > 0) {
                const maxBOB = parseFloat(offer.adv.maxSingleTransAmount || "0");
                finalAvailableUSDT = maxBOB / price;
              }

              // Filter: only offers with >= MIN_USDT_THRESHOLD
              if (finalAvailableUSDT < MIN_USDT_THRESHOLD) {
                return null;
              }

              const amountToTake = Math.min(finalAvailableUSDT, maxUSDT);

              return {
                price,
                availableAmount: amountToTake,
                advertiser: offer.advertiser?.nickName || "Unknown",
                userGrade: offer.advertiser?.userGrade || 0,
              };
            } catch (error) {
              console.error("Error processing offer:", error);
              return null;
            }
          })
          .filter((offer: any): offer is NonNullable<typeof offer> => offer !== null);

        // Remove duplicates WITHIN this batch (keep only the one with highest amount per advertiser)
        const uniqueOffersMap = new Map<string, any>();
        for (const offer of processedOffers) {
          const existing = uniqueOffersMap.get(offer.advertiser);
          if (!existing || offer.availableAmount > existing.availableAmount) {
            uniqueOffersMap.set(offer.advertiser, offer);
          }
        }
        const validOffers = Array.from(uniqueOffersMap.values())
          .sort((a: any, b: any) => b.availableAmount - a.availableAmount);

        console.log(`Batch ${page} - Found ${processedOffers.length} offers, ${validOffers.length} unique advertisers (>= ${MIN_USDT_THRESHOLD} USDT)`);

        // Add to collection, but filter duplicates ACROSS batches
        const existingAdvertisers = new Set(allOffers.map(o => o.advertiser));
        const newUniqueOffers = validOffers.filter((offer: any) => !existingAdvertisers.has(offer.advertiser));

        if (newUniqueOffers.length < validOffers.length) {
          console.log(`  Filtered out ${validOffers.length - newUniqueOffers.length} duplicate advertisers`);
        }

        allOffers = allOffers.concat(newUniqueOffers);

        const newTotal = allOffers.reduce((sum, o) => sum + o.availableAmount, 0);
        console.log(`Total accumulated: ${newTotal.toFixed(0)} USDT from ${allOffers.length} offers`);

        // Stop if we have enough to cover target amount
        if (newTotal >= targetAmount) {
          console.log(`✓ Target reached! ${newTotal.toFixed(0)} >= ${targetAmount} USDT`);
          break;
        }

        // Stop if no new valid offers found
        if (validOffers.length === 0) {
          console.log(`No valid offers in this batch, stopping`);
          break;
        }

        page++;
      } catch (error) {
        console.error(`Batch ${page} - Fetch error:`, error);
        break;
      }
    }

    // If no offers found with high threshold, try again with lower threshold
    if (allOffers.length === 0) {
      console.log(`No offers found with ${MIN_USDT_THRESHOLD} USDT threshold, trying with 100 USDT threshold...`);

      const LOWER_THRESHOLD = 100;
      page = 1;

      while (page <= Math.min(MAX_PAGES, 20)) {
        const currentTotal = allOffers.reduce((sum, o) => sum + o.availableAmount, 0);

        console.log(`Retry batch ${page}... (accumulated: ${currentTotal.toFixed(0)} / ${targetAmount} USDT)`);

        try {
          const response = await fetch(
            "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (compatible; Next.js App)",
              },
              body: JSON.stringify({
                fiat: "BOB",
                page: page,
                rows: BATCH_SIZE,
                asset: "USDT",
                tradeType: "BUY",
                transAmount: searchAmount,
                sortType: "price",
              }),
              signal: AbortSignal.timeout(10000),
            }
          );

          if (!response.ok) break;

          const data = await response.json();
          if (!data || typeof data !== "object" || data.success === false) break;

          let offers = [];
          if (Array.isArray(data)) {
            offers = data;
          } else if (data.data && Array.isArray(data.data)) {
            offers = data.data;
          } else {
            for (const key of Object.keys(data)) {
              if (Array.isArray(data[key])) {
                offers = data[key];
                break;
              }
            }
          }

          if (!offers || offers.length === 0) break;

          const processedOffers = offers
            .map((offer: any) => {
              try {
                if (!offer.adv?.price || typeof offer.adv.price !== "string") return null;

                const price = parseFloat(offer.adv.price);
                if (isNaN(price)) return null;

                const availableUSDT = parseFloat(
                  offer.adv.surplusAmount ||
                    offer.adv.tradableQuantity ||
                    offer.adv.quantity ||
                    offer.adv.dynamicMaxSingleTransQuantity ||
                    offer.adv.maxSingleTransQuantity ||
                    "0"
                );

                const maxUSDT = parseFloat(
                  offer.adv.maxSingleTransQuantity ||
                    offer.adv.maxSingleTransAmount ||
                    "999999"
                );

                let finalAvailableUSDT = availableUSDT;
                if (availableUSDT === 0 && price > 0) {
                  const maxBOB = parseFloat(offer.adv.maxSingleTransAmount || "0");
                  finalAvailableUSDT = maxBOB / price;
                }

                if (finalAvailableUSDT < LOWER_THRESHOLD) return null;

                const amountToTake = Math.min(finalAvailableUSDT, maxUSDT);

                return {
                  price,
                  availableAmount: amountToTake,
                  advertiser: offer.advertiser?.nickName || "Unknown",
                  userGrade: offer.advertiser?.userGrade || 0,
                };
              } catch (error) {
                return null;
              }
            })
            .filter((offer: any): offer is NonNullable<typeof offer> => offer !== null);

          // Remove duplicates WITHIN this batch (keep only the one with highest amount per advertiser)
          const uniqueOffersMap = new Map<string, any>();
          for (const offer of processedOffers) {
            const existing = uniqueOffersMap.get(offer.advertiser);
            if (!existing || offer.availableAmount > existing.availableAmount) {
              uniqueOffersMap.set(offer.advertiser, offer);
            }
          }
          const validOffers = Array.from(uniqueOffersMap.values())
            .sort((a: any, b: any) => b.availableAmount - a.availableAmount);

          // Filter duplicates ACROSS batches
          const existingAdvertisers = new Set(allOffers.map(o => o.advertiser));
          const newUniqueOffers = validOffers.filter((offer: any) => !existingAdvertisers.has(offer.advertiser));

          if (newUniqueOffers.length < validOffers.length) {
            console.log(`  Filtered out ${validOffers.length - newUniqueOffers.length} duplicate advertisers`);
          }

          allOffers = allOffers.concat(newUniqueOffers);

          const newTotal = allOffers.reduce((sum, o) => sum + o.availableAmount, 0);
          console.log(`Retry batch ${page} - Found ${newUniqueOffers.length} unique offers (>= ${LOWER_THRESHOLD} USDT)`);

          if (newTotal >= targetAmount || validOffers.length === 0) break;

          page++;
        } catch (error) {
          console.error(`Retry batch ${page} error:`, error);
          break;
        }
      }
    }

    if (allOffers.length === 0) {
      console.error("No valid offers found even with lower threshold");
      return NextResponse.json(
        {
          success: false,
          error: `No P2P offers available for this amount. The market may not have enough liquidity.`,
          targetAmount: targetAmount,
        },
        { status: 404 }
      );
    }

    // Sort offers by highest amount first for aggregation
    allOffers.sort((a: any, b: any) => b.availableAmount - a.availableAmount);

    const totalAvailable = allOffers.reduce((sum, o) => sum + o.availableAmount, 0);
    console.log(`Final: ${allOffers.length} offers, ${totalAvailable.toFixed(0)} USDT available`);

    // Calculate weighted average price
    const aggregatedOffer = calculateWeightedAveragePrice(allOffers, targetAmount);

    const result = {
      success: true,
      data: {
        usdt_bob: aggregatedOffer.weightedAveragePrice,
        best_price: aggregatedOffer.priceRange.min,
        max_price: aggregatedOffer.priceRange.max,
        price_range: `${aggregatedOffer.priceRange.min.toFixed(2)} - ${aggregatedOffer.priceRange.max.toFixed(2)}`,
        target_amount: targetAmount,
        available_amount: aggregatedOffer.totalAmount,
        offers_count: allOffers.length,
        valid_offers_count: aggregatedOffer.offers.length,
        offers_used: aggregatedOffer.offers,
        last_updated: Math.floor(Date.now() / 1000),
        source: "Binance P2P",
        coverage_percentage: Math.round((aggregatedOffer.totalAmount / targetAmount) * 100),
        strategy: `Progressive batches of ${BATCH_SIZE}, filter >= ${MIN_USDT_THRESHOLD} USDT, weighted by amount`,
        pages_fetched: page,
      },
    };

    console.log("Returning result:", JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error("P2P API error:", error);

    // Return a more detailed error response
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch P2P price data",
        details:
          process.env.NODE_ENV === "development"
            ? {
                message:
                  error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
                targetAmount: targetAmount,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate weighted average price based on amount needed
 * Offers with larger amounts have more weight in the average
 * This ensures that a 2k USDT offer doesn't have the same impact as a 40k USDT offer
 */
function calculateWeightedAveragePrice(
  offers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
  }>,
  targetAmount: number
): AggregatedOffer {
  const usedOffers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
  }> = [];

  let remainingAmount = targetAmount;
  let totalWeightedPrice = 0;
  let totalUsedAmount = 0;

  // Sort by highest amount first (already done in main function, but ensure it)
  const sortedOffers = [...offers].sort((a, b) => b.availableAmount - a.availableAmount);

  console.log(`Calculating weighted average for ${targetAmount} USDT from ${sortedOffers.length} offers`);

  // Fill target amount by taking from offers with highest amounts first
  for (const offer of sortedOffers) {
    if (remainingAmount <= 0) break;

    // Take as much as we can from this offer
    const amountToTake = Math.min(remainingAmount, offer.availableAmount);

    if (amountToTake > 0) {
      usedOffers.push({
        price: offer.price,
        availableAmount: amountToTake,
        advertiser: offer.advertiser,
        userGrade: offer.userGrade,
      });

      // Weighted price: price * amount (weight is proportional to amount)
      totalWeightedPrice += offer.price * amountToTake;
      totalUsedAmount += amountToTake;
      remainingAmount -= amountToTake;

      console.log(
        `  - Using ${amountToTake.toFixed(0)} USDT @ ${offer.price} BOB from ${offer.advertiser}`
      );
    }
  }

  // Calculate weighted average: sum(price * amount) / sum(amount)
  const weightedAveragePrice =
    totalUsedAmount > 0
      ? Math.round((totalWeightedPrice / totalUsedAmount) * 10000) / 10000 // 4 decimals
      : 0;

  const priceRange = {
    min: usedOffers.length > 0 ? Math.min(...usedOffers.map((o) => o.price)) : 0,
    max: usedOffers.length > 0 ? Math.max(...usedOffers.map((o) => o.price)) : 0,
  };

  console.log(`Weighted average: ${weightedAveragePrice} BOB/USDT`);
  console.log(`Used ${usedOffers.length} offers for ${totalUsedAmount.toFixed(0)} USDT`);
  console.log(`Price range: ${priceRange.min} - ${priceRange.max} BOB`);

  return {
    totalAmount: totalUsedAmount,
    weightedAveragePrice,
    offers: usedOffers,
    priceRange,
  };
}
