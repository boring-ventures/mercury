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
    const amount = searchParams.get("amount") || "100"; // Default to 100 USDT
    targetAmount = parseFloat(amount);

    console.log("Fetching P2P price from Binance...", {
      amount,
      targetAmount,
    });

    // Progressive loading: fetch pages until we have enough offers
    const rowsToFetch = 10; // Binance API limit
    const minUsdtThreshold = 1000; // Minimum USDT amount to prioritize
    let allOffers: any[] = [];
    let totalAvailableUsdt = 0;
    let page = 1;
    const maxPages = 10; // Reduced from 20 to prevent too many API calls

    console.log(`Starting progressive loading for ${targetAmount} USDT`);

    // First pass: try to get enough with high-amount offers (≥1k USDT)
    while (totalAvailableUsdt < targetAmount && page <= maxPages) {
      console.log(
        `Fetching page ${page}... (current total: ${totalAvailableUsdt.toFixed(0)} USDT)`
      );

      // Binance P2P API endpoint for USDT/BOB
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
            rows: rowsToFetch,
            asset: "USDT",
            tradeType: "BUY",
            transAmount: amount,
            sortType: "price",
          }),
          signal: AbortSignal.timeout(10000), // Reduced timeout
        }
      );

      console.log(`Page ${page} response status:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Page ${page} Binance P2P API error:`, errorText);
        throw new Error(
          `Binance P2P API responded with status: ${response.status}`
        );
      }

      const data = await response.json();

      // More flexible response validation
      if (!data || typeof data !== "object") {
        console.error(`Page ${page} invalid response - not an object:`, data);
        throw new Error(
          "Invalid response from Binance P2P API - not an object"
        );
      }

      console.log(`Page ${page} response keys:`, Object.keys(data));
      console.log(`Page ${page} response success:`, data.success);
      console.log(`Page ${page} response data length:`, data.data?.length || 0);

      // Check if we have a valid response structure
      if (data.success === false) {
        console.error(`Page ${page} API returned success: false`);
        throw new Error("Binance P2P API returned an error response");
      }

      // Debug: log the full response for large amounts
      if (targetAmount > 100000) {
        console.log(
          `Page ${page} full response:`,
          JSON.stringify(data, null, 2)
        );
      }

      // Extract offers from response
      let offers = [];
      if (Array.isArray(data)) {
        offers = data;
        console.log(`Page ${page} found offers as direct array`);
      } else if (data.data && Array.isArray(data.data)) {
        offers = data.data;
        console.log(`Page ${page} found offers in data array`);
      } else if (data.offers && Array.isArray(data.offers)) {
        offers = data.offers;
        console.log(`Page ${page} found offers in offers array`);
      } else {
        const keys = Object.keys(data);
        console.log(`Page ${page} searching for array in keys:`, keys);
        for (const key of keys) {
          if (Array.isArray(data[key])) {
            offers = data[key];
            console.log(
              `Page ${page} found offers array in key: ${key} with ${offers.length} items`
            );
            break;
          }
        }
      }

      // Check if we have any offers
      if (!offers || offers.length === 0) {
        console.log(`Page ${page} no offers found, stopping pagination`);
        // If this is the first page and no offers found, it means the amount is too large
        if (page === 1) {
          console.log(
            `No offers found for {formatCurrency(targetAmount, "USD")}T`
          );
          return NextResponse.json(
            {
              success: false,
              error: `No P2P offers found for {formatCurrency(targetAmount, "USD")}T. The requested amount may be too large for the current market. Try a smaller amount or check back later.`,
              targetAmount: targetAmount,
            },
            { status: 404 }
          );
        }
        break;
      }

      console.log(`Page ${page} processing ${offers.length} offers`);

      // Process and validate offers from this page
      const validOffers = offers
        .filter((offer: any) => {
          try {
            if (
              !offer.adv ||
              !offer.adv.price ||
              typeof offer.adv.price !== "string"
            ) {
              return false;
            }

            const price = parseFloat(offer.adv.price);
            if (isNaN(price)) {
              return false;
            }

            // Try multiple field names for USDT amounts
            const availableUSDT = parseFloat(
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

            // If we can't find USDT amounts, estimate from BOB amounts
            if (availableUSDT === 0 && offer.adv.price) {
              const maxBOB = parseFloat(
                offer.adv.maxSingleTransAmount || "999999"
              );
              const estimatedUSDT = maxBOB / price;
              return estimatedUSDT >= minUsdtThreshold;
            }

            return availableUSDT >= minUsdtThreshold && maxUSDT > 0;
          } catch (error) {
            console.error("Error processing offer:", error, offer);
            return false;
          }
        })
        .map((offer: any) => {
          try {
            const price = parseFloat(offer.adv.price);

            // Try multiple field names for USDT amounts
            const availableUSDT = parseFloat(
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

            const minUSDT = parseFloat(
              offer.adv.minSingleTransQuantity ||
                offer.adv.minSingleTransAmount ||
                "0"
            );

            // Fallback: if we can't find USDT amounts, estimate from BOB amounts
            let finalAvailableUSDT = availableUSDT;
            if (availableUSDT === 0 && offer.adv.price) {
              const maxBOB = parseFloat(
                offer.adv.maxSingleTransAmount || "999999"
              );
              finalAvailableUSDT = maxBOB / price;
            }

            // Calculate how much USDT we can take from this offer
            const amountToTake = Math.min(finalAvailableUSDT, maxUSDT);

            return {
              price,
              availableAmount: amountToTake,
              advertiser: offer.advertiser?.nickName || "Unknown",
              userGrade: offer.advertiser?.userGrade || 0,
              minAmount: minUSDT,
              maxAmount: maxUSDT,
              totalAvailable: finalAvailableUSDT,
            };
          } catch (error) {
            console.error("Error mapping offer:", error, offer);
            return null;
          }
        })
        .filter(
          (offer: any): offer is NonNullable<typeof offer> => offer !== null
        )
        .sort((a: any, b: any) => b.availableAmount - a.availableAmount); // Sort by available amount (highest first)

      // Add valid offers to our collection
      allOffers = allOffers.concat(validOffers);

      // Calculate total available USDT from all offers
      totalAvailableUsdt = allOffers.reduce(
        (sum: number, offer: any) => sum + offer.availableAmount,
        0
      );

      console.log(`Page ${page} added ${validOffers.length} valid offers`);
      console.log(
        `Total offers: ${allOffers.length}, Total available: ${totalAvailableUsdt.toFixed(0)} USDT`
      );

      // If we have enough offers, stop fetching
      if (totalAvailableUsdt >= targetAmount) {
        console.log(
          `Reached target amount (${targetAmount} USDT) with ${totalAvailableUsdt.toFixed(0)} USDT available`
        );
        break;
      }

      // If we've fetched all pages and still don't have enough, break
      if (page >= maxPages) {
        console.log(
          `Reached maximum pages (${maxPages}), stopping with ${totalAvailableUsdt.toFixed(0)} USDT available`
        );
        break;
      }

      page++;
    }

    // Second pass: if we still don't have enough, include smaller offers (≥100 USDT)
    if (totalAvailableUsdt < targetAmount) {
      console.log(
        `Still need ${(targetAmount - totalAvailableUsdt).toFixed(0)} USDT, fetching smaller offers...`
      );

      // Reset page counter for second pass
      page = 1;
      const maxPagesSecondPass = 5; // Limit second pass to prevent too many API calls

      while (totalAvailableUsdt < targetAmount && page <= maxPagesSecondPass) {
        console.log(
          `Second pass - Fetching page ${page}... (current total: ${totalAvailableUsdt.toFixed(0)} USDT)`
        );

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
              rows: rowsToFetch,
              asset: "USDT",
              tradeType: "BUY",
              transAmount: amount,
              sortType: "price",
            }),
            signal: AbortSignal.timeout(8000), // Shorter timeout for second pass
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Page ${page} Binance P2P API error:`, errorText);
          break;
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          console.error(`Page ${page} invalid response - not an object:`, data);
          break;
        }

        // Check if we have a valid response structure
        if (data.success === false) {
          console.error(`Page ${page} API returned success: false`);
          break;
        }

        // Extract offers from response
        let offers = [];
        if (Array.isArray(data)) {
          offers = data;
        } else if (data.data && Array.isArray(data.data)) {
          offers = data.data;
        } else if (data.offers && Array.isArray(data.offers)) {
          offers = data.offers;
        } else {
          const keys = Object.keys(data);
          for (const key of keys) {
            if (Array.isArray(data[key])) {
              offers = data[key];
              break;
            }
          }
        }

        // Check if we have any offers
        if (!offers || offers.length === 0) {
          console.log(`Page ${page} no offers found, stopping second pass`);
          break;
        }

        console.log(
          `Second pass - Page ${page} processing ${offers.length} offers`
        );

        // Process offers with lower threshold (≥100 USDT) for second pass
        const validOffers = offers
          .filter((offer: any) => {
            try {
              if (
                !offer.adv ||
                !offer.adv.price ||
                typeof offer.adv.price !== "string"
              ) {
                return false;
              }

              const price = parseFloat(offer.adv.price);
              if (isNaN(price)) {
                return false;
              }

              const availableUSDT = parseFloat(
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

              // Lower threshold for second pass (≥100 USDT)
              if (availableUSDT === 0 && offer.adv.price) {
                const maxBOB = parseFloat(
                  offer.adv.maxSingleTransAmount || "999999"
                );
                const estimatedUSDT = maxBOB / price;
                return estimatedUSDT >= 100; // Lower threshold
              }

              return availableUSDT >= 100 && maxUSDT > 0; // Lower threshold
            } catch (error) {
              console.error("Error processing offer:", error, offer);
              return false;
            }
          })
          .map((offer: any) => {
            try {
              const price = parseFloat(offer.adv.price);

              const availableUSDT = parseFloat(
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

              const minUSDT = parseFloat(
                offer.adv.minSingleTransQuantity ||
                  offer.adv.minSingleTransAmount ||
                  "0"
              );

              let finalAvailableUSDT = availableUSDT;
              if (availableUSDT === 0 && offer.adv.price) {
                const maxBOB = parseFloat(
                  offer.adv.maxSingleTransAmount || "999999"
                );
                finalAvailableUSDT = maxBOB / price;
              }

              const amountToTake = Math.min(finalAvailableUSDT, maxUSDT);

              return {
                price,
                availableAmount: amountToTake,
                advertiser: offer.advertiser?.nickName || "Unknown",
                userGrade: offer.advertiser?.userGrade || 0,
                minAmount: minUSDT,
                maxAmount: maxUSDT,
                totalAvailable: finalAvailableUSDT,
              };
            } catch (error) {
              console.error("Error mapping offer:", error, offer);
              return null;
            }
          })
          .filter(
            (offer: any): offer is NonNullable<typeof offer> => offer !== null
          )
          .sort((a: any, b: any) => b.availableAmount - a.availableAmount);

        // Add valid offers to our collection
        allOffers = allOffers.concat(validOffers);

        // Calculate total available USDT from all offers
        totalAvailableUsdt = allOffers.reduce(
          (sum: number, offer: any) => sum + offer.availableAmount,
          0
        );

        console.log(
          `Second pass - Page ${page} added ${validOffers.length} valid offers`
        );
        console.log(
          `Total offers: ${allOffers.length}, Total available: ${totalAvailableUsdt.toFixed(0)} USDT`
        );

        if (totalAvailableUsdt >= targetAmount) {
          console.log(
            `Reached target amount (${targetAmount} USDT) with ${totalAvailableUsdt.toFixed(0)} USDT available`
          );
          break;
        }

        page++;
      }
    }

    // For very large amounts, we'll work with what we have
    // The second pass was causing issues with very large amounts
    if (totalAvailableUsdt < targetAmount) {
      console.log(
        `Only found ${totalAvailableUsdt.toFixed(0)} USDT out of ${targetAmount} requested (${((totalAvailableUsdt / targetAmount) * 100).toFixed(1)}% coverage)`
      );
    }

    if (allOffers.length === 0) {
      console.error("No offers found in any page.");
      throw new Error(
        `No P2P offers found for {formatCurrency(targetAmount, "USD")}T. The requested amount may be too large for the current market. Try a smaller amount or check back later.`
      );
    }

    // Sort all offers by price (lowest first) for aggregation
    allOffers.sort((a: any, b: any) => a.price - b.price);

    console.log(
      `Found ${allOffers.length} valid offers with ${totalAvailableUsdt.toFixed(0)} total USDT available`
    );

    // Check if we have enough offers to meet the target
    if (totalAvailableUsdt < targetAmount * 0.5) {
      console.warn(
        `Only ${totalAvailableUsdt.toFixed(0)} USDT available out of ${targetAmount} requested (${((totalAvailableUsdt / targetAmount) * 100).toFixed(1)}% coverage)`
      );
    }

    // Aggregate offers to meet the target amount
    const aggregatedOffer = aggregateOffers(allOffers, targetAmount);

    if (aggregatedOffer.totalAmount < targetAmount) {
      console.warn(
        `Only ${aggregatedOffer.totalAmount} USDT available out of ${targetAmount} requested`
      );
    }

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
        aggregated_offers_count: aggregatedOffer.offers.length,
        offers_used: aggregatedOffer.offers,
        last_updated: Math.floor(Date.now() / 1000),
        source: "Binance P2P",
        note: `Aggregated ${aggregatedOffer.offers.length} offers for ${targetAmount} USDT (${aggregatedOffer.totalAmount} available)`,
        coverage_percentage: Math.round(
          (aggregatedOffer.totalAmount / targetAmount) * 100
        ),
        strategy: "Progressive loading with high-amount prioritization",
        total_usdt_available: totalAvailableUsdt,
        pages_fetched: page - 1,
        average_offers_per_trader:
          Math.round(
            (aggregatedOffer.offers.length /
              new Set(aggregatedOffer.offers.map((o) => o.advertiser)).size) *
              100
          ) / 100,
      },
    };

    console.log("Returning P2P result:", JSON.stringify(result, null, 2));
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

function aggregateOffers(
  offers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
    minAmount: number;
    maxAmount: number;
    totalAvailable: number;
  }>,
  targetAmount: number
): AggregatedOffer {
  let remainingAmount = targetAmount;
  const usedOffers: Array<{
    price: number;
    availableAmount: number;
    advertiser: string;
    userGrade: number;
  }> = [];
  let totalWeightedPrice = 0;
  let totalUsedAmount = 0;

  // First pass: fill the target amount with best prices
  for (const offer of offers) {
    if (remainingAmount <= 0) break;

    // Calculate how much we can take from this offer
    const amountToTake = Math.min(remainingAmount, offer.availableAmount);

    if (amountToTake > 0) {
      usedOffers.push({
        price: offer.price,
        availableAmount: amountToTake,
        advertiser: offer.advertiser,
        userGrade: offer.userGrade,
      });

      totalWeightedPrice += offer.price * amountToTake;
      totalUsedAmount += amountToTake;
      remainingAmount -= amountToTake;
    }
  }

  // Second pass: add a few more offers for better averaging (2-4 additional offers)
  const additionalOffersNeeded = Math.min(
    4,
    Math.max(2, Math.floor(usedOffers.length * 0.3))
  );
  let additionalOffersAdded = 0;

  for (const offer of offers) {
    if (additionalOffersAdded >= additionalOffersNeeded) break;

    // Skip if we already used this offer
    const alreadyUsed = usedOffers.some(
      (used) => used.advertiser === offer.advertiser
    );
    if (alreadyUsed) continue;

    // Add a small amount from this offer for averaging
    const amountToAdd = Math.min(offer.availableAmount * 0.1, 1000); // 10% of their offer or 1000 USDT max

    if (amountToAdd > 0) {
      usedOffers.push({
        price: offer.price,
        availableAmount: amountToAdd,
        advertiser: offer.advertiser,
        userGrade: offer.userGrade,
      });

      totalWeightedPrice += offer.price * amountToAdd;
      totalUsedAmount += amountToAdd;
      additionalOffersAdded++;
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

  return {
    totalAmount: totalUsedAmount,
    weightedAveragePrice,
    offers: usedOffers,
    priceRange,
  };
}
