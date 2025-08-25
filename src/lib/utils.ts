import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Capitalizes the first letter of each word in a country or city name
 * Handles special cases like "USA" and "UK"
 */
export function capitalizeCountry(country: string): string {
  if (!country) return country;
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    'usa': 'USA',
    'uk': 'UK',
    'uae': 'UAE',
    'peru': 'Perú',
    'south-korea': 'South Korea',
  };
  
  const lowerCountry = country.toLowerCase();
  if (specialCases[lowerCountry]) {
    return specialCases[lowerCountry];
  }
  
  // Capitalize first letter of each word
  return country
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
