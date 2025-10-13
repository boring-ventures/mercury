import { NextResponse } from "next/server";

/**
 * Unified Exchange Rate API
 * Supports USD/BOB, EUR/BOB, and EUR/USD conversions
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "USD";
    const amount = searchParams.get("amount") || "100";

    console.log(`Fetching exchange rate for ${currency}...`, { amount });

    let exchangeRate = 6.96; // Default fallback rate

    if (currency === "USD") {
      // Get USD/BOB from Binance P2P
      try {
        const binanceResponse = await fetch(
          `${request.url.split("/api/")[0]}/api/binance/exchange-rate?amount=${amount}`,
          { signal: AbortSignal.timeout(10000) }
        );

        if (binanceResponse.ok) {
          const binanceData = await binanceResponse.json();
          if (binanceData.success && binanceData.data?.usdt_bob) {
            exchangeRate = binanceData.data.usdt_bob;
            console.log(`USD/BOB from Binance P2P: ${exchangeRate}`);
          }
        }
      } catch (error) {
        console.error("Error fetching USD rate from Binance:", error);
        // Will use fallback rate
      }
    } else if (currency === "EUR") {
      // Get EUR/USD first, then convert to BOB
      try {
        // Option 1: Try exchangerate-api.com (free tier: 1,500 requests/month)
        const eurUsdResponse = await fetch(
          "https://api.exchangerate-api.com/v4/latest/EUR",
          { signal: AbortSignal.timeout(5000) }
        );

        if (eurUsdResponse.ok) {
          const eurData = await eurUsdResponse.json();
          const eurToUsd = eurData.rates?.USD || 1.1; // EUR to USD rate

          console.log(`EUR/USD rate: ${eurToUsd}`);

          // Now get USD/BOB from Binance
          try {
            const binanceResponse = await fetch(
              `${request.url.split("/api/")[0]}/api/binance/exchange-rate?amount=${amount}`,
              { signal: AbortSignal.timeout(10000) }
            );

            if (binanceResponse.ok) {
              const binanceData = await binanceResponse.json();
              const usdToBob = binanceData.data?.usdt_bob || 6.96;

              // Calculate EUR/BOB
              exchangeRate = eurToUsd * usdToBob;
              console.log(`EUR/BOB calculated: ${exchangeRate} (EUR->USD: ${eurToUsd}, USD->BOB: ${usdToBob})`);
            }
          } catch (error) {
            console.error("Error fetching USD/BOB for EUR conversion:", error);
            // Fallback: use estimated rate
            exchangeRate = eurToUsd * 6.96;
          }
        }
      } catch (error) {
        console.error("Error fetching EUR rate:", error);
        // Fallback rate for EUR/BOB (approximately EUR to USD * USD to BOB)
        exchangeRate = 1.1 * 6.96; // ~7.66
      }
    } else if (currency === "BS") {
      // For BS, the rate is 1:1 (no conversion needed)
      exchangeRate = 1.0;
    }

    // Round to 2 decimal places
    exchangeRate = Math.round(exchangeRate * 100) / 100;

    return NextResponse.json({
      success: true,
      data: {
        currency,
        rate: exchangeRate,
        target_currency: "BOB",
        amount: parseFloat(amount),
        last_updated: Math.floor(Date.now() / 1000),
        source: currency === "USD" ? "Binance P2P" : currency === "EUR" ? "ExchangeRate-API + Binance P2P" : "N/A",
      },
    });
  } catch (error) {
    console.error("Exchange rate API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch exchange rate",
      },
      { status: 500 }
    );
  }
}
