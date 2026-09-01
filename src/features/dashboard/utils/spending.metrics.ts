import type { Transaction } from '@/features/movimientos/types/movimiento.types';

function esConfirmadaEnPeriodo(transaction: Transaction): boolean {
  return transaction.enPeriodo && transaction.estado === 'confirmada';
}

/**
 * How much cash actually left this month: sum of `abs(monto)` for
 * negative, `confirmada`, in-period transactions. Refunds don't reduce
 * this — a refund is a separate movement, not an undo of the original
 * charge. See `spendByCategory` for the *other* rule, which does net
 * refunds — the two answer different questions on purpose.
 */
export function totalSpent(transactions: Transaction[]): number {
  return transactions
    .filter((t) => esConfirmadaEnPeriodo(t) && t.monto < 0)
    .reduce((sum, t) => sum + Math.abs(t.monto), 0);
}

/**
 * Mirror of `totalSpent`: sum of `monto` for positive, `confirmada`,
 * in-period transactions — how much came in this month. Same filters,
 * opposite sign; not merely `-totalSpent` since the set of qualifying
 * transactions differs (positive vs. negative `monto`).
 */
export function totalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => esConfirmadaEnPeriodo(t) && t.monto > 0)
    .reduce((sum, t) => sum + t.monto, 0);
}

export interface CategorySpend {
  categoria: string;
  total: number;
}

/**
 * Net spend per category — refunds in the same category net against its
 * expenses (e.g. the Amazon purchase + its exact refund cancel out under
 * "Compras"). A category whose confirmed, in-period movements sum to zero
 * or positive (refunds outweighing purchases, or a pure-income category
 * like "Ingresos") isn't spend and is left out of the result entirely,
 * rather than showing as a $0 bar. Sorted descending by `total`.
 */
export function spendByCategory(transactions: Transaction[]): CategorySpend[] {
  const sumsByCategory = new Map<string, number>();

  for (const t of transactions) {
    if (!esConfirmadaEnPeriodo(t)) continue;
    sumsByCategory.set(t.categoria, (sumsByCategory.get(t.categoria) ?? 0) + t.monto);
  }

  const result: CategorySpend[] = [];
  for (const [categoria, sum] of sumsByCategory) {
    const total = Math.max(-sum, 0);
    if (total > 0) {
      result.push({ categoria, total });
    }
  }

  return result.sort((a, b) => b.total - a.total);
}

/** The single highest-net-spend category, or `undefined` if nothing qualifies as spend. */
export function topCategory(transactions: Transaction[]): CategorySpend | undefined {
  return spendByCategory(transactions)[0];
}

export interface DailySpend {
  /** `YYYY-MM-DD` */
  fecha: string;
  total: number;
}

/**
 * The single day with the highest confirmed, in-period spend. Ties are
 * broken by earliest date — relies on `transactions` being in roughly
 * chronological order (true of `getMovimientos()`'s output), since the
 * first day to reach a given total is only overtaken by a strictly higher
 * one.
 */
export function dayWithHighestSpend(transactions: Transaction[]): DailySpend | undefined {
  const totalsByDay = new Map<string, number>();

  for (const t of transactions) {
    if (!esConfirmadaEnPeriodo(t) || t.monto >= 0) continue;
    const dia = t.fecha.slice(0, 10);
    totalsByDay.set(dia, (totalsByDay.get(dia) ?? 0) + Math.abs(t.monto));
  }

  let best: DailySpend | undefined;
  for (const [fecha, total] of totalsByDay) {
    if (!best || total > best.total) {
      best = { fecha, total };
    }
  }

  return best;
}
