import type { Transaction } from '../types/movimiento.types';
import { CATEGORIA_POR_DEFECTO } from '../transformers/normalize.movimiento.transformer';

/**
 * Distinct `categoria` values present in the given transactions, sorted
 * alphabetically with `"Otros"` pinned last — it's the catch-all bucket,
 * not just another category that happens to sort under "O". This is the
 * single list backing both the category-breakdown chart and the
 * correction `Select`, derived from the data itself: there's no external
 * category taxonomy provided, and hardcoding one would be a bigger
 * assumption than deriving it from what's actually there.
 */
export function getCategoriasConocidas(transactions: Transaction[]): string[] {
  const categorias = new Set(transactions.map((t) => t.categoria));

  const ordenadas = [...categorias].filter((c) => c !== CATEGORIA_POR_DEFECTO).sort((a, b) => a.localeCompare(b, 'es'));

  return categorias.has(CATEGORIA_POR_DEFECTO) ? [...ordenadas, CATEGORIA_POR_DEFECTO] : ordenadas;
}
