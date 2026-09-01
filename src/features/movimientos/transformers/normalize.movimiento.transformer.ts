import type { MovimientoValidado } from '../validators/movimiento.schema';
import type { Transaction } from '../types/movimiento.types';
import { isEstadoConocido } from '../types/movimiento.types';

export type NormalizationFailureReason = 'invalid_cuenta' | 'invalid_periodo';

export type NormalizationResult =
  | { ok: true; transaction: Transaction }
  | { ok: false; reason: NormalizationFailureReason; id: string };

export const CATEGORIA_POR_DEFECTO = 'Otros';

/** True when `fecha`'s `YYYY-MM` matches the dataset's `periodo` (e.g. "2026-08"). */
function estaEnPeriodo(fecha: string, periodo: string): boolean {
  return fecha.slice(0, 7) === periodo;
}

/**
 * Turns one schema-validated movimiento into a `Transaction`, or rejects it
 * with a reason. Two business-validity rules live here, separate from the
 * zod schema (which only checks shape):
 *
 * - `cuenta === null` → invalid, the record is not a transaction we show.
 * - date outside `periodo` AND not `estado: 'programada'` → invalid. A
 *   scheduled future charge is the one deliberate exception.
 *
 * Everything else here is normalization, not filtering: `categoria` null/""
 * becomes `"Otros"`, and `estado` maps to a known value or `'desconocido'`.
 */
export function normalizeMovimiento(movimiento: MovimientoValidado, periodo: string): NormalizationResult {
  if (movimiento.cuenta === null) {
    return { ok: false, reason: 'invalid_cuenta', id: movimiento.id };
  }

  const enPeriodo = estaEnPeriodo(movimiento.fecha, periodo);
  const esProgramada = movimiento.estado === 'programada';

  if (!enPeriodo && !esProgramada) {
    return { ok: false, reason: 'invalid_periodo', id: movimiento.id };
  }

  const categoria =
    movimiento.categoria === null || movimiento.categoria === '' ? CATEGORIA_POR_DEFECTO : movimiento.categoria;

  const transaction: Transaction = {
    id: movimiento.id,
    fecha: movimiento.fecha,
    descripcion: movimiento.descripcion,
    monto: movimiento.monto,
    moneda: movimiento.moneda,
    categoria,
    cuenta: movimiento.cuenta,
    estado: isEstadoConocido(movimiento.estado) ? movimiento.estado : 'desconocido',
    enPeriodo,
  };

  return { ok: true, transaction };
}
