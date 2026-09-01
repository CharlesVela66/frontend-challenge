import type { Transaction } from '@/features/movimientos/types/movimiento.types';

/**
 * `estado` values that count as "pending" for the top bar. `en_disputa` is
 * deliberately excluded: the money already moved, its outcome is just
 * contested — that's a different situation from "hasn't happened yet."
 * (No `en_disputa` record currently survives the movimientos pipeline, but
 * this check doesn't rely on that.)
 */
const ESTADOS_PENDIENTES = ['pendiente', 'programada'] as const;

function esPendiente(transaction: Transaction): boolean {
  return (ESTADOS_PENDIENTES as readonly string[]).includes(transaction.estado);
}

/**
 * Net delta of the visible movements this month — sums `monto` (signed)
 * for every transaction whose `fecha` falls in the dataset's `periodo`,
 * regardless of `estado`. This is NOT a balance: there's no opening amount
 * in this dataset, so it never claims to be "saldo disponible."
 */
export function netMovement(transactions: Transaction[]): number {
  return transactions.filter((transaction) => transaction.enPeriodo).reduce((sum, t) => sum + t.monto, 0);
}

/**
 * Total of transactions that are `pendiente` or `programada`, as an
 * unsigned amount (a "how much is coming" figure, not a signed delta).
 * Deliberately NOT filtered by `enPeriodo` — `txn_060` (`programada`,
 * dated outside the period) is exactly the kind of forward-looking charge
 * this figure should surface.
 */
export function pendingTotal(transactions: Transaction[]): number {
  return transactions.filter(esPendiente).reduce((sum, t) => sum + Math.abs(t.monto), 0);
}
