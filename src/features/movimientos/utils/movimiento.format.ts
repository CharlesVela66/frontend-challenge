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

/**
 * For a bare `YYYY-MM-DD` (no time/offset — e.g. `dayWithHighestSpend`'s
 * grouping key), NOT `formatFecha`'s ISO-with-offset input. Built from the
 * numeric parts via the local-time `Date` constructor on purpose: parsing
 * a date-only string directly (`new Date('2026-08-19')`) reads it as UTC
 * midnight, which can render as the *previous* day once formatted in a
 * timezone behind UTC (this dataset is `-06:00`) — an off-by-one that's
 * easy to miss because it only shows up depending on the viewer's clock.
 */
export function formatFechaSolo(fechaSolo: string): string {
  const [anio, mes, dia] = fechaSolo.split('-');
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(Number(anio), Number(mes) - 1, Number(dia)),
  );
}
