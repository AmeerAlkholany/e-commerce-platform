import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: any): string {
  if (price === null || price === undefined) return "0.00";
  
  // Handle case where price is an object {s, e, d} from Decimal.js
  if (typeof price === 'object' && price.hasOwnProperty('s') && price.hasOwnProperty('d')) {
    // This is a Decimal object that slipped through serialization
    // We can try to guess its value or just use a default if it's too complex
    // For simple cases, we can try to use its custom toJSON or toString if available
    try {
      return Number(price).toFixed(2);
    } catch (e) {
      return "0.00";
    }
  }

  const num = typeof price === 'number' ? price : parseFloat(String(price));
  return isNaN(num) ? "0.00" : num.toFixed(2);
}
