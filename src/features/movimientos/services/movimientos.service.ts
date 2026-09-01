import movimientosJson from '@/data/movimientos.json';
import type { RawMovimientosFile } from '../types/raw.movimiento.types';
import { movimientoSchema } from '../validators/movimiento.schema';
import { normalizeMovimiento } from '../transformers/normalize.movimiento.transformer';
import { dedupeMovimientos } from '../transformers/dedupe.movimientos.transformer';
import type { Transaction } from '../types/movimiento.types';

const data = movimientosJson as RawMovimientosFile;

interface ExclusionCounts {
  invalid_shape: number;
  invalid_periodo: number;
  invalid_monto: number;
  duplicate: number;
}

/**
 * Reads `src/data/movimientos.json` fresh and returns the transactions that
 * passed shape validation (zod), business-validity normalization
 * (`normalizeMovimiento`), and duplicate removal (`dedupeMovimientos`). The
 * source file is never modified — records that don't qualify are simply
 * excluded from the array this function returns, every time it runs.
 * Excluded counts are logged, not swallowed, so it's possible to tell
 * "didn't parse" apart from "parsed but invalid" apart from "duplicate"
 * later.
 */
export function getMovimientos(): Transaction[] {
  const parsedTransactions: Transaction[] = [];
  const excluded: ExclusionCounts = {
    invalid_shape: 0,
    invalid_periodo: 0,
    invalid_monto: 0,
    duplicate: 0,
  };

  for (const raw of data.movimientos) {
    const parsed = movimientoSchema.safeParse(raw);
    if (!parsed.success) {
      excluded.invalid_shape += 1;
      console.warn(`[movimientos] ${raw.id ?? '(sin id)'} no pasó la validación de forma:`, parsed.error.message);
      continue;
    }

    const result = normalizeMovimiento(parsed.data, data.periodo);
    if (!result.ok) {
      excluded[result.reason] += 1;
      continue;
    }

    parsedTransactions.push(result.transaction);
  }

  const transactions = dedupeMovimientos(parsedTransactions);
  excluded.duplicate = parsedTransactions.length - transactions.length;

  const total = excluded.invalid_shape + excluded.invalid_periodo + excluded.invalid_monto + excluded.duplicate;
  if (total > 0) {
    console.info(
      `[movimientos] excluidos ${total} de ${data.movimientos.length}: ` +
        `${excluded.invalid_shape} invalid_shape, ${excluded.invalid_periodo} invalid_periodo, ` +
        `${excluded.invalid_monto} invalid_monto, ${excluded.duplicate} duplicate`,
    );
  }

  return transactions;
}

/** The dataset's `periodo` (e.g. `"2026-08"`) — for display (page heading), not calculation; `Transaction.enPeriodo` already encodes period membership per-record. */
export function getPeriodo(): string {
  return data.periodo;
}
