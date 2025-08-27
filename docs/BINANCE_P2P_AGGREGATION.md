# Binance P2P Aggregation System

## Overview

This system provides intelligent aggregation of Binance P2P offers for large USDT purchases. Instead of relying on a single trader's offer, it aggregates multiple offers from different traders to fulfill large orders efficiently.

## How It Works

### Progressive Loading with High-Amount Prioritization

The system uses a smart progressive loading approach:

1. **Progressive Fetching**: Fetches pages of offers one by one until the target amount is reached
2. **High-Amount Prioritization**: Prioritizes offers with ≥1,000 USDT available amounts
3. **Local Storage**: Saves all fetched offers locally to avoid refetching
4. **Efficient Pagination**: Only fetches additional pages when needed

### Smart Aggregation Algorithm

The system uses a **two-pass greedy algorithm**:

1. **First Pass**: Fills the target amount with the best-priced offers
2. **Second Pass**: Adds 2-4 additional offers for better price averaging

### Key Features

- **USDT-Focused**: Correctly identifies and uses USDT amounts from offers
- **Multi-Trader**: Aggregates offers from different traders
- **Progressive Loading**: Only fetches what's needed
- **High-Amount Priority**: Focuses on offers with ≥1,000 USDT
- **Price Optimization**: Sorts by price (lowest first) for best deals
- **Safety Limits**: Maximum 10 pages to prevent too many API calls
- **Graceful Handling**: Returns 404 for amounts too large for the market

## Limitations

### Market Capacity

The system has practical limits based on market availability:

- **Small amounts** (≤10k USDT): Usually 100% coverage
- **Medium amounts** (10k-100k USDT): Usually 80-100% coverage
- **Large amounts** (100k-200k USDT): Usually 50-80% coverage
- **Very large amounts** (>200k USDT): May have limited availability or no offers

### API Response Examples

**Successful Response (200k USDT):**

```json
{
  "success": true,
  "data": {
    "usdt_bob": 13.9,
    "target_amount": 200000,
    "available_amount": 119092.93,
    "coverage_percentage": 59,
    "strategy": "Progressive loading with high-amount prioritization",
    "pages_fetched": 2
  }
}
```

**No Offers Available (250k USDT):**

```json
{
  "success": false,
  "error": "No P2P offers found for 250,000 USDT. The requested amount may be too large for the current market. Try a smaller amount or check back later.",
  "targetAmount": 250000
}
```
