import type { Transaction } from '@/features/movimientos/types/movimiento.types';

function calificaParaResumen(transaction: Transaction): boolean {
  return transaction.enPeriodo && transaction.estado === 'confirmada' && !transaction.cuentaDesconocida;
}

/**
 * `totalSpent`, `totalIncome`, `spendByCategory`, and `topCategory` all
 * scope to confirmada + in-period + known-account only:
 * - a `pendiente`/`programada` movement hasn't settled yet, so it's
 *   excluded here even though the transactions table shows it;
 * That's why a manual sum of a category's rows in the table can come out
 * higher than that category's bar: the table shows everything valid,
 * these numbers show only what's settled and attributable. Surfaced in
 * the UI (as a caption/hint) next to every figure that uses this scope,
 * so the gap reads as intentional rather than a bug.
 */
export const NOTA_ALCANCE_GASTO =
  'Solo movimientos confirmados de este mes con cuenta conocida (no incluye pendientes, programados, ni el movimiento en disputa).';

/**
 * How much cash actually left this month: sum of `abs(monto)` for
 * negative, `confirmada`, in-period transactions. Refunds don't reduce
 * this — a refund is a separate movement, not an undo of the original
 * charge. See `spendByCategory` for the *other* rule, which does net
 * refunds — the two answer different questions on purpose.
 */
export function totalSpent(transactions: Transaction[]): number {
  return transactions
    .filter((t) => calificaParaResumen(t) && t.monto < 0)
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
    .filter((t) => calificaParaResumen(t) && t.monto > 0)
    .reduce((sum, t) => sum + t.monto, 0);
}

export interface CategorySpend {
  categoria: string;
  total: number;
}

/**
 * Spend per category — sum of `abs(monto)` for negative, confirmed,
 * in-period transactions, grouped by `categoria`. Same filter as
 * `totalSpent`, just bucketed; summing every `total` here always equals
 * `totalSpent`'s number. A positive-`monto` row (income, or a refund) in
 * a category does **not** reduce that category's total — it's simply not
 * counted, the same way `totalSpent` doesn't count it. Concretely: the
 * Amazon purchase (`txn_007`, `-1899`) counts fully toward "Compras";
 * its refund (`txn_028`, `+1899`) doesn't touch that number at all.
 * Sorted descending by `total`.
 */
export function spendByCategory(transactions: Transaction[]): CategorySpend[] {
  const sumsByCategory = new Map<string, number>();

  for (const t of transactions) {
    if (!calificaParaResumen(t) || t.monto >= 0) continue;
    sumsByCategory.set(t.categoria, (sumsByCategory.get(t.categoria) ?? 0) + Math.abs(t.monto));
  }

  return [...sumsByCategory.entries()]
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);
}

/** The single highest-spend category, or `undefined` if nothing qualifies as spend. */
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
    if (!calificaParaResumen(t) || t.monto >= 0) continue;
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
