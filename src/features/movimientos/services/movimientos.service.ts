import movimientosJson from '@/data/movimientos.json';
import type { RawMovimientosFile } from '../types/raw.movimiento.types';
import { movimientoSchema } from '../validators/movimiento.schema';
import { normalizeMovimiento } from '../transformers/normalize.movimiento.transformer';
import type { Transaction } from '../types/movimiento.types';

const data = movimientosJson as RawMovimientosFile;

interface ExclusionCounts {
  invalid_shape: number;
  invalid_cuenta: number;
  invalid_periodo: number;
}

/**
 * Reads `src/data/movimientos.json` fresh and returns the transactions that
 * passed shape validation (zod) and business-validity normalization
 * (`normalizeMovimiento`). The source file is never modified — records that
 * don't qualify are simply excluded from the array this function returns,
 * every time it runs. Excluded counts are logged, not swallowed, so it's
 * possible to tell "didn't parse" apart from "parsed but invalid" later.
 *
 * Note: this list is not yet deduplicated — see `dedupeMovimientos`
 * (transformers/dedupe.movimientos.transformer.ts).
 */
export function getMovimientos(): Transaction[] {
  const transactions: Transaction[] = [];
  const excluded: ExclusionCounts = { invalid_shape: 0, invalid_cuenta: 0, invalid_periodo: 0 };

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

    transactions.push(result.transaction);
  }

  const total = excluded.invalid_shape + excluded.invalid_cuenta + excluded.invalid_periodo;
  if (total > 0) {
    console.info(
      `[movimientos] excluidos ${total} de ${data.movimientos.length}: ` +
        `${excluded.invalid_shape} invalid_shape, ${excluded.invalid_cuenta} invalid_cuenta, ${excluded.invalid_periodo} invalid_periodo`,
    );
  }

  return transactions;
}
