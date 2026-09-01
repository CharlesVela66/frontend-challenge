import type { Transaction } from '../types/movimiento.types';

function claveDuplicado(transaction: Transaction): string {
  return `${transaction.fecha}|${transaction.monto}|${transaction.cuenta}|${transaction.descripcion}`;
}

/**
 * Removes exact-duplicate transactions: same `fecha`, `monto`, `cuenta` and
 * `descripcion`. Operates on the whole array (not record-by-record like
 * `normalizeMovimiento`) since it needs to see every transaction to find
 * matches — that's why it's a separate transformer and a separate phase.
 *
 * Within a duplicate group, keeps the first record with
 * `estado === 'confirmada'` if one exists; otherwise keeps the first
 * record in original order. Concretely: `txn_021`/`txn_022` (both
 * `confirmada`) keep the first by order — arbitrary but deterministic.
 * `txn_044`/`txn_045` keep the `confirmada` one over the `pendiente` one —
 * that one is principled, per the stated rule.
 */
export function dedupeMovimientos(transactions: Transaction[]): Transaction[] {
  const groups = new Map<string, Transaction[]>();

  for (const transaction of transactions) {
    const key = claveDuplicado(transaction);
    const group = groups.get(key);
    if (group) {
      group.push(transaction);
    } else {
      groups.set(key, [transaction]);
    }
  }

  const result: Transaction[] = [];

  for (const group of groups.values()) {
    let kept: Transaction | undefined;
    for (const candidate of group) {
      kept ??= candidate;
      if (candidate.estado === 'confirmada') {
        kept = candidate;
        break;
      }
    }
    if (kept) {
      result.push(kept);
    }
  }

  return result;
}
