import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatNumber(amount: number): string {
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseAmountInput(input: string): string {
  // Remove all non-numeric characters except comma and dot
  const cleanInput = input.replace(/[^\d,.]/g, '');
  
  // Replace comma with dot for decimal
  return cleanInput.replace(',', '.');
}
