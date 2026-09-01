/**
 * Formats an amount in its own currency — always the real currency code,
 * never silently relabeled as MXN. There's no FX rate available for the
 * one USD record in the dataset, so it's shown at face value tagged as
 * USD rather than converted or hidden. Falls back to a plain number +
 * code if `moneda` isn't a currency `Intl` recognizes, instead of
 * throwing on a data value we don't control.
 */
export function formatMonto(monto: number, moneda: string): string {
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: moneda }).format(monto);
  } catch {
    return `${monto.toFixed(2)} ${moneda}`;
  }
}

/** `fecha` (ISO 8601 with offset) as a short, locale date — e.g. "19 ago 2026". */
export function formatFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(fecha));
}
