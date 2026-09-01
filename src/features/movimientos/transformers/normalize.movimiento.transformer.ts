import type { MovimientoValidado } from '../validators/movimiento.schema';
import { TIPOS_CAMBIO_A_MXN } from '../constants/tipo-cambio.constants';
import type { Transaction } from '../types/movimiento.types';
import { isEstadoConocido } from '../types/movimiento.types';

export type NormalizationFailureReason = 'invalid_cuenta' | 'invalid_periodo' | 'invalid_monto';

export type NormalizationResult =
  | { ok: true; transaction: Transaction }
  | { ok: false; reason: NormalizationFailureReason; id: string };

export const CATEGORIA_POR_DEFECTO = 'Otros';

/** True when `fecha`'s `YYYY-MM` matches the dataset's `periodo` (e.g. "2026-08"). */
function estaEnPeriodo(fecha: string, periodo: string): boolean {
  return fecha.slice(0, 7) === periodo;
}

/**
 * Converts `monto` to MXN using the fixed rate in `TIPOS_CAMBIO_A_MXN`.
 * A currency with no entry (already `'MXN'`, or one nobody's added a rate
 * for) passes through unchanged — this is why the lookup, not an
 * if/else on `'USD'` specifically, is the right shape here.
 */
function convertirAMxn(monto: number, moneda: string): { monto: number; moneda: string } {
  const tipoCambio = TIPOS_CAMBIO_A_MXN[moneda];
  if (tipoCambio === undefined) {
    return { monto, moneda };
  }
  return { monto: monto * tipoCambio, moneda: 'MXN' };
}

/**
 * Turns one schema-validated movimiento into a `Transaction`, or rejects it
 * with a reason. Three business-validity rules live here, separate from
 * the zod schema (which only checks shape):
 *
 * - `cuenta === null` → invalid, the record is not a transaction we show.
 * - `monto === 0` → invalid — nothing actually moved (e.g. a $0.00 fee
 *   line), so it's not a "movimiento" for this screen's purposes, not a
 *   real expense or income.
 * - date outside `periodo` AND not `estado: 'programada'` → invalid. A
 *   scheduled future charge is the one deliberate exception.
 *
 * Everything else here is normalization, not filtering: `categoria` null/""
 * becomes `"Otros"`, `estado` maps to a known value or `'desconocido'`, and
 * `monto`/`moneda` get converted to MXN (see `convertirAMxn`) so nothing
 * downstream ever has to reason about mixed currencies.
 */
export function normalizeMovimiento(movimiento: MovimientoValidado, periodo: string): NormalizationResult {
  if (movimiento.cuenta === null) {
    return { ok: false, reason: 'invalid_cuenta', id: movimiento.id };
  }

  if (movimiento.monto === 0) {
    return { ok: false, reason: 'invalid_monto', id: movimiento.id };
  }

  const enPeriodo = estaEnPeriodo(movimiento.fecha, periodo);
  const esProgramada = movimiento.estado === 'programada';

  if (!enPeriodo && !esProgramada) {
    return { ok: false, reason: 'invalid_periodo', id: movimiento.id };
  }

  const categoria =
    movimiento.categoria === null || movimiento.categoria === '' ? CATEGORIA_POR_DEFECTO : movimiento.categoria;

  const { monto, moneda } = convertirAMxn(movimiento.monto, movimiento.moneda);

  const transaction: Transaction = {
    id: movimiento.id,
    fecha: movimiento.fecha,
    descripcion: movimiento.descripcion,
    monto,
    moneda,
    categoria,
    cuenta: movimiento.cuenta,
    estado: isEstadoConocido(movimiento.estado) ? movimiento.estado : 'desconocido',
    enPeriodo,
  };

  return { ok: true, transaction };
}
