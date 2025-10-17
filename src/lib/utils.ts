import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas for thousands and dots for decimals
 * This is the standard format for Spanish-speaking countries
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param currency - Currency symbol to prepend (optional)
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 2,
  currency?: string
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return currency ? `${currency}0,00` : "0,00";
  }

  // Convert to number and round to specified decimals
  const numValue = Number(value);

  // Check if the conversion resulted in NaN
  if (isNaN(numValue)) {
    return currency ? `${currency}0,00` : "0,00";
  }

  const roundedValue =
    Math.round(numValue * Math.pow(10, decimals)) / Math.pow(10, decimals);

  // Additional check for roundedValue
  if (isNaN(roundedValue)) {
    return currency ? `${currency}0,00` : "0,00";
  }

  // Format with Spanish locale (commas for thousands, dots for decimals)
  const formatted = roundedValue.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return currency ? `${currency}${formatted}` : formatted;
}

/**
 * Formats a currency amount with proper formatting
 * @param amount - The amount to format
 * @param currency - The currency code (USD, Bs, etc.)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "USD",
  decimals: number = 2
): string {
  // Handle undefined or null currency
  const safeCurrency = currency || "USD";
  const currencySymbol = safeCurrency === "Bs" ? "" : "$";

  return (
    formatNumber(amount, decimals, currencySymbol) +
    (safeCurrency === "Bs" ? " Bs" : ` ${safeCurrency}`)
  );
}

/**
 * Formats an exchange rate with proper Spanish number formatting
 * @param rate - The exchange rate to format
 * @param decimals - Number of decimal places (default: 2 for exchange rates)
 * @returns Formatted exchange rate string
 */
export function formatExchangeRate(
  rate: number | null | undefined,
  decimals: number = 2
): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return "0,00";
  }

  // Convert to number and round to specified decimals
  const numValue = Number(rate);
  const roundedValue =
    Math.round(numValue * Math.pow(10, decimals)) / Math.pow(10, decimals);

  // Format with Spanish locale (commas for thousands, dots for decimals)
  return roundedValue.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a percentage with proper Spanish number formatting
 * @param percentage - The percentage value to format
 * @param decimals - Number of decimal places (default: 2 for percentages)
 * @returns Formatted percentage string (without % symbol)
 */
export function formatPercentage(
  percentage: number | null | undefined,
  decimals: number = 2
): string {
  if (percentage === null || percentage === undefined || isNaN(percentage)) {
    return "0,00";
  }

  // Convert to number and round to specified decimals
  const numValue = Number(percentage);
  const roundedValue =
    Math.round(numValue * Math.pow(10, decimals)) / Math.pow(10, decimals);

  // Format with Spanish locale (commas for thousands, dots for decimals)
  return roundedValue.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Capitalizes the first letter of each word in a country or city name
 * Handles special cases like "USA" and "UK"
 */
export function capitalizeCountry(country: string): string {
  if (!country) return country;

  // Handle special cases
  const specialCases: Record<string, string> = {
    usa: "USA",
    uk: "UK",
    uae: "UAE",
    peru: "Perú",
    "south-korea": "South Korea",
  };

  const lowerCountry = country.toLowerCase();
  if (specialCases[lowerCountry]) {
    return specialCases[lowerCountry];
  }

  // Capitalize first letter of each word
  return country
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
