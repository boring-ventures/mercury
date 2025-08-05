import { NextResponse } from "next/server";

interface BinanceOffer {
  adv: {
    price: string;
    minSingleTransAmount?: string;
    maxSingleTransAmount?: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get("amount") || "100"; // Default to 100 USDT
    const minAmount = searchParams.get("minAmount") || "50"; // Default minimum
    const maxAmount = searchParams.get("maxAmount") || "1000"; // Default maximum

    console.log("Fetching P2P price from Binance...", {
      amount,
      minAmount,
      maxAmount,
    });

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
          page: 1,
          rows: 10,
          asset: "USDT",
          tradeType: "BUY",
          transAmount: amount,
          sortType: "price",
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    console.log("Binance P2P response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Binance P2P API error:", errorText);
      throw new Error(
        `Binance P2P API responded with status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Binance P2P data received:", JSON.stringify(data, null, 2));

    if (!data.success || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid Binance P2P response:", data);
      throw new Error("Invalid response from Binance P2P API");
    }

    // Filter offers based on amount range
    const validOffers = data.data.filter((offer: BinanceOffer) => {
      if (
        !offer.adv ||
        !offer.adv.price ||
        typeof offer.adv.price !== "string"
      ) {
        return false;
      }

      const price = parseFloat(offer.adv.price);
      if (isNaN(price)) return false;

      // Check if the offer's min/max amount range includes our target amount
      const minAmountNum = parseFloat(offer.adv.minSingleTransAmount || "0");
      const maxAmountNum = parseFloat(
        offer.adv.maxSingleTransAmount || "999999"
      );
      const targetAmount = parseFloat(amount);

      return targetAmount >= minAmountNum && targetAmount <= maxAmountNum;
    });

    if (validOffers.length === 0) {
      throw new Error(`No valid P2P offers found for ${amount} USDT`);
    }

    // Calculate average price from valid offers
    const topOffers = validOffers.slice(0, 10); // Take top 10 valid offers
    const totalPrice = topOffers.reduce((sum: number, offer: BinanceOffer) => {
      return sum + parseFloat(offer.adv.price);
    }, 0);
    const averagePrice =
      Math.round((totalPrice / topOffers.length) * 100) / 100;

    // Get the best (lowest) price
    const bestPrice =
      Math.round(
        Math.min(
          ...topOffers.map((offer: BinanceOffer) => parseFloat(offer.adv.price))
        ) * 100
      ) / 100;

    // Get price range
    const maxPrice =
      Math.round(
        Math.max(
          ...topOffers.map((offer: BinanceOffer) => parseFloat(offer.adv.price))
        ) * 100
      ) / 100;

    const result = {
      success: true,
      data: {
        usdt_bob: averagePrice,
        best_price: bestPrice,
        max_price: maxPrice,
        price_range: `${bestPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`,
        target_amount: parseFloat(amount),
        offers_count: validOffers.length,
        valid_offers_count: topOffers.length,
        last_updated: Math.floor(Date.now() / 1000),
        source: "Binance P2P",
        note: `Average of ${topOffers.length} offers for ${amount} USDT`,
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
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}
