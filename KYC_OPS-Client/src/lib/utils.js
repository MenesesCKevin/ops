import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases condicionales con Tailwind; evita conflictos usando tailwind-merge.
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Clases para anillo de foco accesible (tokens HSBC) */
export const focusRing = cn(
  'focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset'
);
