"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, DollarSign } from "lucide-react";

export default function TestBinancePage() {
  const [amount, setAmount] = useState("100000");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/binance/exchange-rate?amount=${amount}`
      );
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Binance P2P Aggregation Test
        </h1>
        <p className="text-muted-foreground">
          Test the enhanced API that aggregates multiple offers for large orders
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>
            Enter the amount of USDT you want to buy and test the aggregation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Amount (USDT)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in USDT"
                className="w-full"
              />
            </div>
            <Button
              onClick={handleTest}
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Aggregation"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {result.target_amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Target USDT</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {result.available_amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available USDT
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {result.coverage_percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Price Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Weighted Average Price
                  </p>
                  <p className="text-2xl font-bold">{result.usdt_bob} BOB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="text-lg font-semibold">
                    {result.price_range} BOB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offers Used */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Offers Used ({result.aggregated_offers_count})
              </CardTitle>
              <CardDescription>
                Breakdown of offers used to fulfill the order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.offers_used.map((offer: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{offer.advertiser}</p>
                        <p className="text-sm text-muted-foreground">
                          Grade: {offer.userGrade}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {offer.availableAmount.toLocaleString()} USDT
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @ {offer.price} BOB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Source:</strong> {result.source}
                </p>
                <p>
                  <strong>Strategy:</strong> {result.strategy}
                </p>
                <p>
                  <strong>Pages Fetched:</strong>{" "}
                  {result.pages_fetched || "N/A"}
                </p>
                <p>
                  <strong>Total USDT Available:</strong>{" "}
                  {result.total_usdt_available?.toLocaleString() || "N/A"}
                </p>
                <p>
                  <strong>Average Offers per Trader:</strong>{" "}
                  {result.average_offers_per_trader || "N/A"}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(result.last_updated * 1000).toLocaleString()}
                </p>
                <p>
                  <strong>Note:</strong> {result.note}
                </p>
                <p>
                  <strong>Total Offers Found:</strong> {result.offers_count}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
